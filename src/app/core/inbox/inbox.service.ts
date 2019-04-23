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
import { ConversationService } from './conversation.service';
import { Response } from '@angular/http';

const USER_BASE_PATH = environment.siteUrl +  'user/';
@Injectable()

export class InboxService {
  private API_URL = 'bff/messaging/inbox';
  private _conversations: InboxConversation[];
  private selfId: string;
  private nextPageToken: number = null;
  private pageSize = 30;
  public errorRetrievingInbox = false;

  constructor(private http: HttpService,
    private persistencyService: PersistencyService,
    private messageService: MessageService,
    private conversationService: ConversationService,
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

  public getInboxFeatureFlag(): Observable<boolean> {
    return this.featureflagService.getFlag('web_inbox_projections');
  }

  public init() {
    this.conversationService.subscribeChatEvents();
    this.selfId = this.userService.user.id;
    this.conversationService.selfId = this.selfId;
    this.getInbox()
    .catch(() => {
      this.errorRetrievingInbox = true;
      return this.persistencyService.getStoredInbox();
    })
    .subscribe((conversations: InboxConversation[]) => {
      this.eventService.emit(EventService.INBOX_LOADED, conversations);
      this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
    });
  }

  public loadMorePages() {
    this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, false);
    this.getNextPage()
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

  private getInbox(): Observable<any> {
    this.messageService.totalUnreadMessages = 0;
    return this.http.get(this.API_URL, {
      page_size: this.pageSize
    })
    .map(res => {
      return this.conversations = this.processInboxResponse(res);
    });
  }

  private getNextPage(): Observable<any> {
      return this.http.get(this.API_URL, {
        page_size: this.pageSize,
        from: this.nextPageToken
      })
      .map(res => {
        return this.conversations = this.conversations.concat(this.processInboxResponse(res));
      });
  }

  private processInboxResponse(res: Response): InboxConversation[] {
    const r = res.json();
    this.nextPageToken = r.next_from || null;
    // In order to avoid adding repeated conversations
    const newConvs = r.conversations.filter(newConv => {
      return (this.conversations
        && this.conversations.find(existingConv => existingConv.id === newConv.hash)) ? null : newConv;
    });
    return this.buildConversations(newConvs);
  }

  private buildConversations(conversations): InboxConversation[] {
    return conversations.map((conv) => {
      const conversation = InboxConversation.fromJSON(conv, this.selfId);
      this.messageService.totalUnreadMessages += conversation.unreadCounter;
      return conversation;
    });
  }

}
