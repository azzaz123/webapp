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
import { UserService } from '../user/user.service';

@Injectable()

export class InboxService {
  private API_URL = 'bff/messaging/inboxes/mine';
  public _conversations: InboxConversation[];
  private selfId: string;

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
    this.eventService.subscribe(EventService.NEW_MESSAGE, (message: InboxMessage) => {
      this.processNewMessage(message);
    });
    this.eventService.subscribe(EventService.CHAT_SIGNAL, (signal: ChatSignal) => {
      this.processChatSignal(signal);
    });
    this.getInbox().subscribe((conversations: InboxConversation[]) => {
      this.saveInbox(conversations);
      this.eventService.emit(EventService.INBOX_LOADED, conversations);
      this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
    });
  }

  private getInbox(): Observable<any> {
    this.messageService.totalUnreadMessages = 0;
    return this.http.get(this.API_URL)
    .map(res => {
      const r = res.json();
      this.saveMessages(r.conversations);
      return this.conversations = this.buildConversations(r.conversations);
    });
  }

  private saveInbox(inboxConversations: InboxConversation[]) {
    this.persistencyService.updateInbox(inboxConversations);
  }

  private processNewMessage(message: InboxMessage) {
    const conversation = this.conversations.find(c => c.id === message.thread);
    if (conversation) {
      const newMessage = message;
      if (conversation.lastMessage && conversation.lastMessage.id !== newMessage.id) {
        this.bumpConversation(conversation);
        conversation.lastMessage = newMessage;
        conversation.modifiedDate = conversation.lastMessage.date;
        if (!message.fromSelf) {
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
      let lastMessage: InboxMessage = null;
      let dateModified: Date = null;
      if (conv.messages && conv.messages.length) {
        const lastMsg = conv.messages[0];
        const fromSelf = lastMsg.from_user_hash === this.selfId;
        if (lastMsg.type === 'text') {
        lastMessage = new InboxMessage(lastMsg.id, conv.hash, lastMsg.text, lastMsg.from_user_hash, fromSelf, new Date(lastMsg.timestamp),
        lastMsg.status, lastMsg.payload);
        dateModified = new Date(lastMsg.timestamp);
        } else {
          // TODO - handle case when last message is a third voice type and may NOT have the 'text' property
        }
      }
      const user = this.buildInboxUser(conv.with_user);
      const item = this.buildInboxItem(conv.item);
      const conversation = new InboxConversation(conv.hash, dateModified, user, item, conv.phone_shared, conv.unread_messages, lastMessage);
      this.messageService.totalUnreadMessages += conversation.unreadCounter;
      return conversation;
    });
  }

  private buildInboxUser(user: any): InboxUser {
    if (!user) {
      return InboxUserPlaceholder;
    }
    const userBlocked = Boolean(user.available && user.blocked);
    return new InboxUser(user.hash, user.name, userBlocked, user.available);
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

  private saveMessages(conversations: any) {
    conversations.map(conv => {
      const messages = [];
      conv.messages.map(msg => messages.push(new InboxMessage(msg.id, conv.hash, msg.text, msg.from_user_hash,
        msg.from_user_hash === this.selfId, new Date(msg.timestamp), msg.status, msg.payload)));
      this.persistencyService.saveInboxMessages(messages);
    });
  }
}
