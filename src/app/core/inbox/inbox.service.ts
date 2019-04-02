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

const USER_BASE_PATH = environment.siteUrl +  'user/';
@Injectable()

export class InboxService {
  private API_URL = 'bff/messaging/inboxes/mine';
  private _conversations: InboxConversation[];
  private selfId: string;
  public errorRetrievingInbox = false;

  constructor(private http: HttpService,
    private persistencyService: PersistencyService,
    private messageService: MessageService,
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

  private getInbox(): Observable<any> {
    this.messageService.totalUnreadMessages = 0;
    return this.http.get(this.API_URL)
    .map(res => {
      const r = res.json();
      return this.conversations = this.buildConversations(r.conversations);
    });
  }

  private buildConversations(conversations): InboxConversation[] {
    return conversations.map((conv) => {
      const user = this.buildInboxUser(conv.with_user);
      const item = this.buildInboxItem(conv.item);
      const messages = this.buildInboxMessages(conv);
      const lastMessage = messages[0];
      const dateModified = lastMessage.date;
      const conversation = new InboxConversation(conv.hash, dateModified, user, item, messages, conv.phone_shared,
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
    const textMessages = conversation.messages.filter(m => m.type === 'text').map(m => new InboxMessage(m.id, conversation.hash, m.text,
      m.from_self ? this.selfId : (conversation.with_user ? conversation.with_user.hash : null), m.from_self, new Date(m.timestamp),
      m.status, m.payload));
    return textMessages;
  }
}
