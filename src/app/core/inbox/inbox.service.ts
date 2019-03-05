import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { PersistencyService } from '../persistency/persistency.service';
import { InboxConversation } from '../conversation/conversation';
import { MessageService } from '../message/message.service';
import { InboxItem } from '../item/item';
import { InboxUser } from '../user/user';
import { InboxImage } from '../user/user-response.interface';
import { FeatureflagService } from '../user/featureflag.service';
import { Message, messageStatus, statusOrder } from '../message/message';
import { EventService } from '../event/event.service';
import { ChatSignal, chatSignalType } from '../message/chat-signal.interface';

@Injectable()

export class InboxService {
  private API_URL = 'bff/messaging/inboxes/mine';
  public _conversations: InboxConversation[];

  constructor(private http: HttpService,
    private persistencyService: PersistencyService,
    private messageService: MessageService,
    private featureflagService: FeatureflagService,
    private eventService: EventService) {}


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
    this.eventService.subscribe(EventService.NEW_MESSAGE, (message: Message) => {
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

  private processNewMessage(message: Message) {
    const conversation = this.conversations.find(c => c.id === message.thread);
    if (conversation) {
      const newMessage = message;
      if (conversation.lastMessage && conversation.lastMessage.id !== newMessage.id) {
        conversation.lastMessage = newMessage;
        conversation.modifiedDate = conversation.lastMessage.date;
      if (!message.fromSelf) {
        conversation.unreadCounter++;
        this.messageService.totalUnreadMessages++;
      }
        }
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
    return conversations.map(conv => {
      let lastMessage: Message = null;
      let dateModified: Date = null;
      if (conv.messages && conv.messages.length) {
        const lastMsg = conv.messages[conv.messages.length - 1];
        lastMessage = new Message(lastMsg.id, conv.hash, lastMsg.text, lastMsg.from_user_hash, new Date(lastMsg.timestamp),
        lastMsg.status, lastMsg.payload);
        lastMessage.fromSelf = lastMessage.from !== conv.with_user.hash;
        dateModified = new Date(lastMsg.timestamp);
      }
      const user = this.buildInboxUser(conv.with_user);
      const item = this.buildInboxItem(conv.item);
      const conversation = new InboxConversation(conv.hash, dateModified, user, item, lastMessage, conv.unread_messages || 0,
        conv.phone_shared);
      this.messageService.totalUnreadMessages += conversation.unreadCounter;
      return conversation;
    });
  }

  private buildInboxUser(user: any) {
    return new InboxUser(user.hash, user.name, user.blocked);
  }

  private buildInboxItem(item) {
    const image: InboxImage = {
      urls_by_size: {
        small: item && item.image_url ? item.image_url : null
      }
    };
    return new InboxItem(item.hash, item.price, item.title, image, item.status);
  }

  private saveMessages(conversations: any) {
    conversations.map(conv => {
      const messages = [];
      conv.messages.map(msg => messages.push(new Message(msg.id, conv.hash, msg.text, msg.from_user_hash,
        new Date(msg.timestamp), msg.status, msg.payload)));
      this.persistencyService.saveMessages(messages);
    });
  }
}
