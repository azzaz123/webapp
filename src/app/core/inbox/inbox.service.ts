import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { PersistencyService } from '../persistency/persistency.service';
import { InboxConversation } from '../../chat/chat-with-inbox/inbox/inbox-conversation/inbox-conversation';
import { MessageService } from '../message/message.service';
import { InboxItem, InboxItemPlaceholder, InboxImage } from '../../chat/chat-with-inbox/inbox/inbox-item';
import { InboxUser, InboxUserPlaceholder } from '../../chat/chat-with-inbox/inbox/inbox-user';
import { FeatureflagService } from '../user/featureflag.service';
import { InboxMessage } from '../../chat/chat-with-inbox/message/inbox-message';
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
      .catch((err) => {
        this.errorRetrievingInbox = true;
        return null;
      })
      .subscribe((conversations: InboxConversation[]) => {
        this.eventService.emit(EventService.INBOX_LOADED, conversations);
        this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
      });
  }

  public shouldLoadMorePages(): Boolean {
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
    this.nextPageToken = r.next_from ? r.next_from : null; // TODO: this will come in header response r.headers.get('NAMEOF')
    // In order to avoid adding repeated conversations
    const newConvs = r.conversations.filter(newConv => {
      return (this.conversations
        && this.conversations.find(existingConv => existingConv.id === newConv.hash)) ? null : newConv;
    });
    return this.buildConversations(newConvs);
  }

  private buildConversations(conversations): InboxConversation[] {
    return conversations.map((conv) => {
      const user = this.buildInboxUser(conv.with_user);
      const item = this.buildInboxItem(conv.item);
      const messages = this.buildInboxMessages(conv);
      const nextPageToken = conv.next_from || null;
      const lastMessage = messages[0];
      const dateModified = lastMessage.date;
      const conversation = new InboxConversation(conv.hash, dateModified, user, item, nextPageToken, messages, conv.phone_shared,
        conv.unread_messages, lastMessage);
      this.messageService.totalUnreadMessages += conversation.unreadCounter;
      return conversation;
    });
  }

  private buildInboxUser(user: any): InboxUser {
    if (!user) {
      return InboxUserPlaceholder;
    }
    const userBlocked = Boolean(user.available && user.blocked);
    const profileUrl = USER_BASE_PATH + user.slug;
    return new InboxUser(user.hash, user.name, userBlocked, user.available, profileUrl, user.image_url, user.response_rate,
      user.score, user.location);
  }

  private buildInboxItem(item: any): InboxItem {
    const image: InboxImage = {
      urls_by_size: {
        small: item && item.image_url ? item.image_url : null
      }
    };
    if (!item) {
      return InboxItemPlaceholder;
    }
    return new InboxItem(item.hash, item.price, item.title, image, item.status);
  }

  private buildInboxMessages(conversation) {
    // TODO - handle third voice type message (type === '? TBD');
    const textMessages = conversation.messages.messages.filter(m => m.type === 'text')
    .map(m => new InboxMessage(m.id, conversation.hash, m.text,
      m.from_self ? this.selfId : (conversation.with_user ? conversation.with_user.hash : null), m.from_self, new Date(m.timestamp),
      m.status, m.payload));
    return textMessages;
  }
}
