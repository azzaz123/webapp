import { Injectable } from '@angular/core';
import { HttpServiceNew } from '../http/http.service.new';
import { Observable } from 'rxjs';
import { PersistencyService } from '../persistency/persistency.service';
import { InboxConversation } from '../../chat/model';
import { MessageService } from '../message/message.service';
import { FEATURE_FLAGS_ENUM, FeatureflagService } from '../user/featureflag.service';
import { EventService } from '../event/event.service';
import { UserService } from '../user/user.service';
import { InboxConversationService } from './inbox-conversation.service';
import { InboxApi, InboxConversationApi } from '../../chat/model/api';
import { map, tap } from 'rxjs/operators';
import { uniqBy } from 'lodash-es';

@Injectable()
export class InboxService {
  public static readonly PAGE_SIZE = 30;

  public conversations: InboxConversation[] = [];
  public archivedConversations: InboxConversation[] = [];

  private inboxReady = false;
  private archivedInboxReady = false;

  private selfId: string;
  private nextPageToken: string = null;
  private nextArchivedPageToken: string = null;

  public errorRetrievingInbox = false;
  public errorRetrievingArchived = false;

  constructor(private httpClient: HttpServiceNew,
              private persistencyService: PersistencyService,
              private messageService: MessageService,
              private conversationService: InboxConversationService,
              private featureflagService: FeatureflagService,
              private eventService: EventService,
              private userService: UserService) {
  }

  public getInboxFeatureFlag$(): Observable<boolean> {
    return this.featureflagService.getFlag(FEATURE_FLAGS_ENUM.INBOX_PROJECTIONS);
  }

  public init() {
    this.conversationService.subscribeChatEvents();
    this.selfId = this.userService.user.id;
    this.conversationService.selfId = this.selfId;
    this.subscribeArchiveEvents();
    this.subscribeUnarchiveEvents();

    this.getInbox$()
    .catch(() => {
      this.errorRetrievingInbox = true;
      return this.persistencyService.getStoredInbox();
    })
    .subscribe((conversations: InboxConversation[]) => {
      this.conversations = conversations;
      this.inboxReady = true;
      this.eventService.emit(EventService.INBOX_LOADED, conversations, 'LOAD_INBOX');
      this.eventService.emit(EventService.INBOX_READY, true);
      this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
    });

    this.getArchivedInbox$()
    .catch(() => {
      this.errorRetrievingArchived = true;
      return this.persistencyService.getArchivedStoredInbox();
    }).subscribe((conversations: InboxConversation[]) => {
      this.eventService.emit(EventService.ARCHIVED_INBOX_LOADED, conversations);
      this.archivedInboxReady = true;
      this.eventService.emit(EventService.ARCHIVED_INBOX_READY, true);
      this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
    });

    this.eventService.subscribe(EventService.PRIVACY_LIST_UPDATED, (blockedUsers: string[]) => {
      blockedUsers.map(id => {
        this.conversations.filter(conv => conv.user.id === id && !conv.user.blocked)
        .map(conv => conv.user.blocked = true);
        this.archivedConversations.filter(conv => conv.user.id === id && !conv.user.blocked)
        .map(conv => conv.user.blocked = true);
      });
      this.conversations.filter(conv => conv.user.blocked && blockedUsers.indexOf(conv.user.id) === -1)
      .map(conv => conv.user.blocked = false);
      this.archivedConversations.filter(conv => conv.user.blocked && blockedUsers.indexOf(conv.user.id) === -1)
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
    return this.httpClient.get<InboxApi>('bff/messaging/inbox', [
      { key: 'page_size', value: InboxService.PAGE_SIZE },
      { key: 'max_messages', value: InboxConversationService.MESSAGES_IN_CONVERSATION }
    ])
    .pipe(
      tap((inbox: InboxApi) => this.nextPageToken = inbox.next_from || null),
      map((inbox: InboxApi) => this.conversations = this.processInboxResponse(inbox))
    );
  }

  public getNextPage$(): Observable<InboxConversation[]> {
    return this.httpClient.get<InboxApi>('bff/messaging/inbox', [
      { key: 'page_size', value: InboxService.PAGE_SIZE },
      { key: 'from', value: this.nextPageToken }
    ])
    .pipe(
      tap((inbox: InboxApi) => this.nextPageToken = inbox.next_from || null),
      map((inbox: InboxApi) => this.conversations = this.processInboxResponse(inbox))
    );
  }

  public getArchivedInbox$(): Observable<InboxConversation[]> {
    return this.httpClient.get<InboxApi>('bff/messaging/archived', [
      { key: 'page_size', value: InboxService.PAGE_SIZE },
      { key: 'max_messages', value: InboxConversationService.MESSAGES_IN_CONVERSATION }
    ])
    .pipe(
      tap((inbox: InboxApi) => this.nextArchivedPageToken = inbox.next_from || null),
      map((inbox: InboxApi) => this.archivedConversations = this.processArchivedInboxResponse(inbox))
    );
  }

  public getNextArchivedPage$(): Observable<InboxConversation[]> {
    return this.httpClient.get<InboxApi>('bff/messaging/archived', [
      { key: 'page_size', value: InboxService.PAGE_SIZE },
      { key: 'from', value: this.nextArchivedPageToken }
    ])
    .pipe(
      tap((inbox: InboxApi) => this.nextArchivedPageToken = inbox.next_from || null),
      map((inbox: InboxApi) => this.archivedConversations = this.archivedConversations = this.processArchivedInboxResponse(inbox))
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
    this.conversationService.sendReceiveSignalByConversations(conversations);
    return uniqBy([...this.conversations, ...conversations], 'id');
  }

  private processArchivedInboxResponse(response: InboxApi): InboxConversation[] {
    return uniqBy([...this.archivedConversations, ...this.buildArchivedConversations(response.conversations)], 'id');
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
      const index = this.conversations.indexOf(conversation);
      this.conversations.splice(index, 1);
      this.archivedConversations.unshift(conversation);
      this.archivedConversations.sort((first, second) => second.lastMessage.date.getTime() - first.lastMessage.date.getTime());
    });
  }

  private subscribeUnarchiveEvents() {
    this.eventService.subscribe(EventService.CONVERSATION_UNARCHIVED, (conversation) => {
      const index = this.archivedConversations.indexOf(conversation);
      this.archivedConversations.splice(index, 1);
      this.conversations.unshift(conversation);
      this.conversations.sort((first, second) => second.lastMessage.date.getTime() - first.lastMessage.date.getTime());
    });
  }
}
