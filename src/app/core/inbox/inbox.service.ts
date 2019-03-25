import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { PersistencyService } from '../persistency/persistency.service';
import { InboxConversation } from '../../chat/chat-with-inbox/inbox/inbox-conversation/inbox-conversation';
import { MessageService } from '../message/message.service';
import { InboxItem, InboxItemPlaceholder, InboxImage } from '../../chat/chat-with-inbox/inbox/inbox-item';
import { InboxUser, InboxUserPlaceholder } from '../../chat/chat-with-inbox/inbox/inbox-user';
import { FeatureflagService } from '../user/featureflag.service';
import { InboxMessage, messageStatus, statusOrder } from '../../chat/chat-with-inbox/message/inbox-message';
import { EventService } from '../event/event.service';
import { ChatSignal, chatSignalType } from '../message/chat-signal.interface';
import { Message } from '../message/message';
import { UserService } from '../user/user.service';
import { Message } from '../message/message';

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
    this.eventService.subscribe(EventService.NEW_MESSAGE, (message: Message) => {
      const inboxMessage = new InboxMessage(message.id, message.thread, message.message, message.from,
        message.fromSelf, message.date, message.status, message.payload, message.phoneRequest);
      this.processNewMessage(inboxMessage);
    });
    this.eventService.subscribe(EventService.CHAT_SIGNAL, (signal: ChatSignal) => {
      this.processChatSignal(signal);
    });
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
      this.conversations = this.buildConversations(r.conversations);
      this.saveInbox(this.conversations);
      return this.conversations;
    });
  }

  private saveInbox(inboxConversations: InboxConversation[]) {
    this.persistencyService.updateStoredInbox(inboxConversations);
  }

  private processNewMessage(newMessage: InboxMessage) {
    const conversation = this.conversations.find(c => c.id === newMessage.thread);
    if (conversation) {
      if (conversation.lastMessage && conversation.lastMessage.id !== newMessage.id) {
        this.bumpConversation(conversation);
        conversation.lastMessage = newMessage;
        conversation.modifiedDate = conversation.lastMessage.date;
        if (!newMessage.fromSelf) {
          conversation.unreadCounter++;
          this.messageService.totalUnreadMessages++;
        }
      }
    }
  }

  private bumpConversation(conversation: InboxConversation) {
    const index: number = this.conversations.indexOf(conversation);
    if (index > 0) {
      this.conversations.splice(index, 1);
      this.conversations.unshift(conversation);
    }
  }

  private processChatSignal(signal: ChatSignal) {
    const conversation = this.conversations.find(c => c.id === signal.thread);
    const newStatus = signal.type;
    if (conversation) {
      const lastMessage = conversation.lastMessage;
    if (signal.type === chatSignalType.READ) {
      if (signal.fromSelf !== lastMessage.fromSelf && signal.timestamp >= lastMessage.date.getTime()) {
        lastMessage.status = messageStatus.READ;
        this.updateUnreadCounters(signal, conversation);
      }
    } else if (signal.messageId === lastMessage.id  && statusOrder.indexOf(newStatus) > statusOrder.indexOf(lastMessage.status)) {
      lastMessage.status = newStatus;
    }
  }
  }

  private updateUnreadCounters(signal: ChatSignal, conversation: InboxConversation) {
    if (signal.fromSelf) {
      this.messageService.totalUnreadMessages -= conversation.unreadCounter;
      conversation.unreadCounter = 0;
    }
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
    return new InboxUser(user.hash, user.name, userBlocked, user.available, user.slug, user.image_url, user.response_rate,
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
    // TODO - handle third voice type message (type === 'TBD');
    const textMessages = conversation.messages.filter(m => m.type === 'text').map(m => new InboxMessage(m.id, conversation.hash, m.text,
      m.from_user_hash, m.from_user_hash === this.selfId, new Date(m.timestamp), m.status, m.payload));
    this.persistencyService.saveInboxMessages(textMessages);
    return textMessages;
  }
}
