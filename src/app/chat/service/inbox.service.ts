import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { InboxConversation } from '../model';
import { MessageService } from './message.service';
import { FeatureflagService } from '../../core/user/featureflag.service';
import { EventService } from '../../core/event/event.service';
import { UserService } from '../../core/user/user.service';
import { InboxConversationService } from './inbox-conversation.service';
import { InboxApi, InboxConversationApi } from '../model/api';
import { map, tap } from 'rxjs/operators';
import { uniqBy } from 'lodash-es';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class InboxService {
  public static readonly PAGE_SIZE = 30;

  private inboxReady = false;
  private archivedInboxReady = false;

  private selfId: string;
  private nextPageToken: string = null;
  private nextArchivedPageToken: string = null;

  public errorRetrievingInbox = false;
  public errorRetrievingArchived = false;

  constructor(private http: HttpClient,
              private messageService: MessageService,
              private inboxConversationService: InboxConversationService,
              private featureflagService: FeatureflagService,
              private eventService: EventService,
              private userService: UserService) {
  }

  public init() {
    this.inboxConversationService.subscribeChatEvents();
    this.selfId = this.userService.user.id;
    this.inboxConversationService.selfId = this.selfId;
    this.subscribeArchiveEvents();
    this.subscribeUnarchiveEvents();

    this.getInbox$()
    .catch(() => {
      this.errorRetrievingInbox = true;
      return of([]);
    })
    .subscribe((conversations: InboxConversation[]) => {
      this.inboxConversationService.conversations = conversations;
      this.inboxReady = true;
      this.eventService.emit(EventService.INBOX_LOADED, conversations, 'LOAD_INBOX');
      this.eventService.emit(EventService.INBOX_READY, true);
      this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
    });

    this.getArchivedInbox$()
    .catch(() => {
      this.errorRetrievingArchived = true;
      return of([]);
    }).subscribe((conversations: InboxConversation[]) => {
      this.eventService.emit(EventService.ARCHIVED_INBOX_LOADED, conversations);
      this.archivedInboxReady = true;
      this.eventService.emit(EventService.ARCHIVED_INBOX_READY, true);
      this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
    });

    this.eventService.subscribe(EventService.PRIVACY_LIST_UPDATED, (blockedUsers: string[]) => {
      blockedUsers.map(id => {
        this.inboxConversationService.conversations
        .filter(conv => conv.user.id === id && !conv.user.blocked)
        .map(conv => conv.user.blocked = true);
        this.inboxConversationService.archivedConversations
        .filter(conv => conv.user.id === id && !conv.user.blocked)
        .map(conv => conv.user.blocked = true);
      });
      this.inboxConversationService.conversations
      .filter(conv => conv.user.blocked && blockedUsers.indexOf(conv.user.id) === -1)
      .map(conv => conv.user.blocked = false);
      this.inboxConversationService.archivedConversations
      .filter(conv => conv.user.blocked && blockedUsers.indexOf(conv.user.id) === -1)
      .map(conv => conv.user.blocked = false);
    });
  }

  public loadMorePages() {
    this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, false);
    this.getNextPage$()
    .catch(() => {
      this.errorRetrievingInbox = true;
      return Observable.of([]);
    })
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
    .catch(() => {
      this.errorRetrievingArchived = true;
      return Observable.of([]);
    })
    .subscribe((conversations: InboxConversation[]) => {
      this.eventService.emit(EventService.ARCHIVED_INBOX_LOADED, conversations);
      this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
    });
  }

  public shouldLoadMoreArchivedPages(): boolean {
    return this.nextArchivedPageToken !== null;
  }

  public getInbox$(): Observable<InboxConversation[]> {
    this.messageService.totalUnreadMessages = 0;
    return this.http.get<InboxApi>(`${environment.baseUrl}bff/messaging/inbox`, {
      params: { page_size: InboxService.PAGE_SIZE.toString(), max_messages: InboxConversationService.MESSAGES_IN_CONVERSATION.toString() }
    })
    .pipe(
      tap((inbox: InboxApi) => this.nextPageToken = inbox.next_from || null),
      map((inbox: InboxApi) => this.inboxConversationService.conversations = this.processInboxResponse(inbox))
    );
  }

  public getNextPage$(): Observable<InboxConversation[]> {
    return this.http.get<InboxApi>(`${environment.baseUrl}bff/messaging/inbox`, {
      params: {
        page_size: InboxService.PAGE_SIZE.toString(),
        from: this.nextPageToken
      }
    })
    .pipe(
      tap((inbox: InboxApi) => this.nextPageToken = inbox.next_from || null),
      map((inbox: InboxApi) => this.inboxConversationService.conversations = this.processInboxResponse(inbox))
    );
  }

  public getArchivedInbox$(): Observable<InboxConversation[]> {
    return this.http.get<InboxApi>(`${environment.baseUrl}bff/messaging/archived`, {
      params: {
        page_size: InboxService.PAGE_SIZE.toString(),
        max_messages: InboxConversationService.MESSAGES_IN_CONVERSATION.toString()
      }
    })
    .pipe(
      tap((inbox: InboxApi) => this.nextArchivedPageToken = inbox.next_from || null),
      map((inbox: InboxApi) => this.inboxConversationService.archivedConversations = this.processArchivedInboxResponse(inbox))
    );
  }

  public getNextArchivedPage$(): Observable<InboxConversation[]> {
    return this.http.get<InboxApi>(`${environment.baseUrl}bff/messaging/archived`, {
      params: {
        page_size: InboxService.PAGE_SIZE.toString(),
        from: this.nextArchivedPageToken
      }
    })
    .pipe(
      tap((inbox: InboxApi) => this.nextArchivedPageToken = inbox.next_from || null),
      map((inbox: InboxApi) =>
        this.inboxConversationService.archivedConversations
          = this.inboxConversationService.archivedConversations = this.processArchivedInboxResponse(inbox))
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
    return uniqBy([...this.inboxConversationService.archivedConversations, ...this.buildArchivedConversations(response.conversations)], 'id');
  }

  private buildArchivedConversations(conversations: InboxConversationApi[]) {
    return conversations
    .map((conversationResponse: InboxConversationApi) => InboxConversation.fromJSON(conversationResponse, this.selfId));
  }

  private buildConversations(conversations: InboxConversationApi[]): InboxConversation[] {
    return conversations.map((conversationResponse: InboxConversationApi) => {
      const conversation = InboxConversation.fromJSON(conversationResponse, this.selfId);
      this.messageService.totalUnreadMessages += conversation.unreadCounter;
      return conversation;
    });
  }

  private subscribeArchiveEvents() {
    this.eventService.subscribe(EventService.CONVERSATION_ARCHIVED, (conversation) => {
      const index = this.inboxConversationService.conversations.indexOf(conversation);
      this.inboxConversationService.conversations.splice(index, 1);
      this.inboxConversationService.archivedConversations.unshift(conversation);
      this.inboxConversationService.archivedConversations
      .sort((first, second) => second.lastMessage.date.getTime() - first.lastMessage.date.getTime());
    });
  }

  private subscribeUnarchiveEvents() {
    this.eventService.subscribe(EventService.CONVERSATION_UNARCHIVED, (conversation) => {
      const index = this.inboxConversationService.archivedConversations.indexOf(conversation);
      this.inboxConversationService.archivedConversations.splice(index, 1);
      this.inboxConversationService.conversations.unshift(conversation);
      this.inboxConversationService.conversations
      .sort((first, second) => second.lastMessage.date.getTime() - first.lastMessage.date.getTime());
    });
  }
}
