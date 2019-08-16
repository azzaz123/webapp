import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { PersistencyService } from '../persistency/persistency.service';
import { InboxConversation } from '../../chat/chat-with-inbox/inbox/inbox-conversation/inbox-conversation';
import { MessageService } from '../message/message.service';
import { FeatureflagService } from '../user/featureflag.service';
import { EventService } from '../event/event.service';
import { UserService } from '../user/user.service';
import { environment } from '../../../environments/environment';
import { InboxConversationService } from './inbox-conversation.service';
import { Response } from '@angular/http';
import * as _ from 'lodash';

const USER_BASE_PATH = environment.siteUrl + 'user/';

@Injectable()

export class InboxService {
  private API_URL = 'bff/messaging/inbox';
  private ARCHIVED_API_URL = '/bff/messaging/archived';
  private _conversations: InboxConversation[] = [];
  private _archivedConversations: InboxConversation[] = [];
  private selfId: string;
  private nextPageToken: number = null;
  private nextArchivedPageToken: number = null;
  private pageSize = 30;
  public errorRetrievingInbox = false;
  public errorRetrievingArchived = false;

  constructor(private http: HttpService,
              private persistencyService: PersistencyService,
              private messageService: MessageService,
              private conversationService: InboxConversationService,
              private featureflagService: FeatureflagService,
              private eventService: EventService,
              private userService: UserService) {
  }

  set conversations(value: InboxConversation[]) {
    this._conversations = value;
  }

  get conversations(): InboxConversation[] {
    return this._conversations;
  }

  set archivedConversations(value: InboxConversation[]) {
    this._archivedConversations = value;
  }

  get archivedConversations(): InboxConversation[] {
    return this._archivedConversations;
  }

  public getInboxFeatureFlag$(): Observable<boolean> {
    return this.featureflagService.getFlag('web_inbox_projections');
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
    .subscribe((conversations) => {
      this.eventService.emit(EventService.INBOX_LOADED, conversations);
      this.eventService.emit(EventService.INBOX_READY, true);
      this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
    });

    this.getArchivedInbox$()
    .catch(() => {
      this.errorRetrievingArchived = true;
      return this.persistencyService.getArchivedStoredInbox();
    })
    .subscribe((conversations) => {
      this.eventService.emit(EventService.ARCHIVED_INBOX_LOADED, conversations);
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
      this.eventService.emit(EventService.INBOX_LOADED, conversations);
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

  private getInbox$(): Observable<any> {
    this.messageService.totalUnreadMessages = 0;
    return this.http.get(this.API_URL, {
      page_size: this.pageSize,
      max_messages: InboxConversationService.MESSAGES_IN_CONVERSATION
    })
    .map(res => {
      return this.conversations = this.processInboxResponse(res);
    });
  }

  private getArchivedInbox$(): Observable<any> {
    return this.http.get(this.ARCHIVED_API_URL, {
      page_size: this.pageSize
    })
    .map(res => {
      return this.archivedConversations = this.processArchivedInboxResponse(res);
    });
  }

  private getNextPage$(): Observable<any> {
    return this.http.get(this.API_URL, {
      page_size: this.pageSize,
      from: this.nextPageToken
    })
    .map(res => {
      return this.conversations = this.conversations.concat(this.processInboxResponse(res));
    });
  }

  private getNextArchivedPage$(): Observable<any> {
    return this.http.get(this.API_URL, {
      page_size: this.pageSize,
      from: this.nextArchivedPageToken
    })
    .map(res => {
      return this.conversations = this.conversations.concat(this.processArchivedInboxResponse(res));
    });
  }

  private processInboxResponse(response: Response): InboxConversation[] {
    const reloadConversations = response.json();
    this.nextPageToken = reloadConversations.next_from || null;
    // In order to avoid adding repeated conversations - if use see this code after 1.11.2019 remove comment lines
    // This code do not remove duplicates because ones are not returned by backend. This line of code poses a problem when we reload page
    // and list of local conversations is the same like in the backend and for this reason every conversation is treat like duplicate
    // and we see empty inbox
    // const conversationWithRemovedDuplicates = reloadConversations.conversations.filter(conversation =>
    //   _.find(this.conversations, localConversation => localConversation.id === conversation.hash) ? null : conversation);
    // return this.buildConversations(conversationWithRemovedDuplicates);
    return this.buildConversations(reloadConversations.conversations);
  }

  private processArchivedInboxResponse(res: Response): InboxConversation[] {
    const r = res.json();
    this.nextArchivedPageToken = r.next_from || null;
    // In order to avoid adding repeated conversations
    const newConvs = r.conversations.filter(newConv => {
      return (this.archivedConversations
        && this.archivedConversations.find(existingConv => existingConv.id === newConv.hash)) ? null : newConv;
    });
    return newConvs.map((conv) => InboxConversation.fromJSON(conv, this.selfId));
  }

  private buildConversations(conversations): InboxConversation[] {
    return conversations.map((conv) => {
      const conversation = InboxConversation.fromJSON(conv, this.selfId);
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
