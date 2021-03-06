import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventService } from '@core/event/event.service';
import { RemoteConsoleService } from '@core/remote-console';
import { UserService } from '@core/user/user.service';
import { environment } from '@environments/environment';
import { ConnectionType } from 'app/core/remote-console/connection-type';
import { uniqBy } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { InboxConversation } from '../model';
import { InboxApi, InboxConversationApi } from '../model/api';
import { InboxConversationService } from './inbox-conversation.service';

@Injectable()
export class InboxService {
  public static readonly PAGE_SIZE = 30;
  public errorRetrievingInbox = false;
  public errorRetrievingArchived = false;

  private inboxReady = false;
  private archivedInboxReady = false;

  private selfId: string;
  private nextPageToken: string = null;
  private nextArchivedPageToken: string = null;

  constructor(
    private http: HttpClient,
    private unreadChatMessagesService: UnreadChatMessagesService,
    private inboxConversationService: InboxConversationService,
    private eventService: EventService,
    private userService: UserService,
    private remoteConsoleService: RemoteConsoleService
  ) {}

  public init() {
    this.inboxConversationService.subscribeChatEvents();
    this.selfId = this.userService.user.id;
    this.inboxConversationService.selfId = this.selfId;
    this.subscribeArchiveEvents();
    this.subscribeUnarchiveEvents();

    this.getInbox$()
      .pipe(
        catchError(() => {
          this.errorRetrievingInbox = true;
          this.remoteConsoleService.sendChatConnectionTime(ConnectionType.INBOX, false);
          return of([]);
        })
      )
      .subscribe((conversations: InboxConversation[]) => {
        this.remoteConsoleService.sendChatConnectionTime(ConnectionType.INBOX, true);
        this.inboxConversationService.conversations = conversations;
        this.inboxReady = true;
        this.eventService.emit(EventService.INBOX_LOADED, conversations, 'LOAD_INBOX');
        this.eventService.emit(EventService.INBOX_READY, true);
        this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
      });

    this.getArchivedInbox$()
      .pipe(
        catchError(() => {
          this.errorRetrievingArchived = true;
          return of([]);
        })
      )
      .subscribe((conversations: InboxConversation[]) => {
        this.eventService.emit(EventService.ARCHIVED_INBOX_LOADED, conversations);
        this.archivedInboxReady = true;
        this.eventService.emit(EventService.ARCHIVED_INBOX_READY, true);
        this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
      });

    this.eventService.subscribe(EventService.PRIVACY_LIST_UPDATED, (blockedUsers: string[]) => {
      blockedUsers.map((id) => {
        this.inboxConversationService.conversations
          .filter((conv) => conv.user.id === id && !conv.user.blocked)
          .map((conv) => (conv.user.blocked = true));
        this.inboxConversationService.archivedConversations
          .filter((conv) => conv.user.id === id && !conv.user.blocked)
          .map((conv) => (conv.user.blocked = true));
      });
      this.inboxConversationService.conversations
        .filter((conv) => conv.user.blocked && blockedUsers.indexOf(conv.user.id) === -1)
        .map((conv) => (conv.user.blocked = false));
      this.inboxConversationService.archivedConversations
        .filter((conv) => conv.user.blocked && blockedUsers.indexOf(conv.user.id) === -1)
        .map((conv) => (conv.user.blocked = false));
    });
  }

  public loadMorePages() {
    this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, false);
    this.getNextPage$()
      .pipe(
        catchError(() => {
          this.errorRetrievingInbox = true;
          return of([]);
        })
      )
      .subscribe((conversations: InboxConversation[]) => {
        this.eventService.emit(EventService.INBOX_LOADED, conversations, 'LOAD_MORE_PAGES');
        this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
      });
  }

  public shouldLoadMorePages(): boolean {
    return this.nextPageToken !== null;
  }

  public loadMoreArchivedPages() {
    this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, false);
    this.getNextArchivedPage$()
      .pipe(
        catchError(() => {
          this.errorRetrievingArchived = true;
          return of([]);
        })
      )
      .subscribe((conversations: InboxConversation[]) => {
        this.eventService.emit(EventService.ARCHIVED_INBOX_LOADED, conversations);
        this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
      });
  }

  public shouldLoadMoreArchivedPages(): boolean {
    return this.nextArchivedPageToken !== null;
  }

  public getInbox$(): Observable<InboxConversation[]> {
    this.unreadChatMessagesService.totalUnreadMessages = 0;
    return this.http
      .get<InboxApi>(`${environment.baseUrl}bff/messaging/inbox`, {
        params: {
          page_size: InboxService.PAGE_SIZE.toString(),
          max_messages: InboxConversationService.MESSAGES_IN_CONVERSATION.toString(),
        },
      })
      .pipe(
        tap((inbox: InboxApi) => (this.nextPageToken = inbox.next_from || null)),
        map((inbox: InboxApi) => (this.inboxConversationService.conversations = this.processInboxResponse(inbox)))
      );
  }

  public getNextPage$(): Observable<InboxConversation[]> {
    return this.http
      .get<InboxApi>(`${environment.baseUrl}bff/messaging/inbox`, {
        params: {
          page_size: InboxService.PAGE_SIZE.toString(),
          from: this.nextPageToken,
        },
      })
      .pipe(
        tap((inbox: InboxApi) => (this.nextPageToken = inbox.next_from || null)),
        map((inbox: InboxApi) => (this.inboxConversationService.conversations = this.processInboxResponse(inbox)))
      );
  }

  public getArchivedInbox$(): Observable<InboxConversation[]> {
    return this.http
      .get<InboxApi>(`${environment.baseUrl}bff/messaging/archived`, {
        params: {
          page_size: InboxService.PAGE_SIZE.toString(),
          max_messages: InboxConversationService.MESSAGES_IN_CONVERSATION.toString(),
        },
      })
      .pipe(
        tap((inbox: InboxApi) => (this.nextArchivedPageToken = inbox.next_from || null)),
        map((inbox: InboxApi) => (this.inboxConversationService.archivedConversations = this.processArchivedInboxResponse(inbox)))
      );
  }

  public getNextArchivedPage$(): Observable<InboxConversation[]> {
    return this.http
      .get<InboxApi>(`${environment.baseUrl}bff/messaging/archived`, {
        params: {
          page_size: InboxService.PAGE_SIZE.toString(),
          from: this.nextArchivedPageToken,
        },
      })
      .pipe(
        tap((inbox: InboxApi) => (this.nextArchivedPageToken = inbox.next_from || null)),
        map((inbox: InboxApi) => (this.inboxConversationService.archivedConversations = this.processArchivedInboxResponse(inbox)))
      );
  }

  public isInboxReady(): boolean {
    return this.inboxReady;
  }

  public isArchivedInboxReady(): boolean {
    return this.archivedInboxReady;
  }

  private processInboxResponse(inbox: InboxApi): InboxConversation[] {
    const conversations: InboxConversation[] = this.buildConversations(inbox.conversations);
    this.inboxConversationService.sendReceiveSignalByConversations(conversations);
    return uniqBy([...this.inboxConversationService.conversations, ...conversations], 'id');
  }

  private processArchivedInboxResponse(response: InboxApi): InboxConversation[] {
    return uniqBy(
      [...this.inboxConversationService.archivedConversations, ...this.buildArchivedConversations(response.conversations)],
      'id'
    );
  }

  private buildArchivedConversations(conversations: InboxConversationApi[]) {
    return conversations.map((conversationResponse: InboxConversationApi) => InboxConversation.fromJSON(conversationResponse, this.selfId));
  }

  private buildConversations(conversations: InboxConversationApi[]): InboxConversation[] {
    return conversations.map((conversationResponse: InboxConversationApi) => {
      const conversation = InboxConversation.fromJSON(conversationResponse, this.selfId);
      this.unreadChatMessagesService.totalUnreadMessages += conversation.unreadCounter;
      return conversation;
    });
  }

  private subscribeArchiveEvents() {
    this.eventService.subscribe(EventService.CONVERSATION_ARCHIVED, (conversation) => {
      const index = this.inboxConversationService.conversations.indexOf(conversation);
      this.inboxConversationService.conversations.splice(index, 1);
      this.inboxConversationService.archivedConversations.unshift(conversation);
      this.inboxConversationService.archivedConversations.sort(
        (first, second) => second.lastMessage.date.getTime() - first.lastMessage.date.getTime()
      );
    });
  }

  private subscribeUnarchiveEvents() {
    this.eventService.subscribe(EventService.CONVERSATION_UNARCHIVED, (conversation) => {
      const index = this.inboxConversationService.archivedConversations.indexOf(conversation);
      this.inboxConversationService.archivedConversations.splice(index, 1);
      this.inboxConversationService.conversations.unshift(conversation);
      this.inboxConversationService.conversations.sort(
        (first, second) => second.lastMessage.date.getTime() - first.lastMessage.date.getTime()
      );
    });
  }
}
