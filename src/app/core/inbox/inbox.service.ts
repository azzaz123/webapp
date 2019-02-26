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
import { Message } from '../message/message';
import { EventService } from '../event/event.service';
import { ChatSignal, chatSignalType } from '../message/chat-signal.interface';

@Injectable()

export class InboxService {
  private API_URL = 'api/v3/instant-messaging/archive/inboxes/mine';
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
    return Observable.of(true);
    // return this.featureflagService.getFlag('web_inbox_projections');
  }

  public init() {
    console.log('subscribe 1');
    this.eventService.subscribe(EventService.NEW_MESSAGE, (message: Message) => {
      console.log('nsw Msg', message);
      this.updateInboxConversation(message);
      // this.updateLastMessage(message);
    });
    this.eventService.subscribe(EventService.CHAT_SIGNAL, (signal: ChatSignal) => {
      this.updateInboxConversation(signal);
    });
    this.getInbox().subscribe((conversations: InboxConversation[]) => {
      console.log('ping');
      this.saveInbox(conversations);
      this.eventService.emit(EventService.INBOX_LOADED, conversations);
    });
  }

  private getInbox(): Observable<any> {
    this.messageService.totalUnreadMessages = 0;
    // return this.http.get(this.API_URL)
    return this.http.getNoBase('assets/json/inbox-projection-data-contract.json')
    .map(res => {
      const r = res.json();
      return this.conversations = this.buildConversations(r.conversations);
    });
  }

  private saveInbox(inboxConversations: InboxConversation[]) {
    this.persistencyService.updateInbox(inboxConversations);
  }

  public updateInboxConversation(arg: Message | ChatSignal) {
    this.updateLastMessage(arg);
  }

  private updateLastMessage(arg: Message | ChatSignal) {
    const conversation = this.conversations.find(c => c.id === arg.thread);
    if (conversation) {
      if (arg instanceof Message) {
        conversation.lastMessage = arg;
      } else if (arg instanceof ChatSignal && !arg.fromSelf) {
        switch (arg.type) {
          case chatSignalType.READ:
          {}
        }
        // TODO - u`date msg status here
      }
    }
  }

  private buildConversations(conversations): InboxConversation[] {
    return conversations.map(conv => {
      let lastMessage: Message = null;
      let dateModified = null;
      if (conv.messages && conv.messages.length) {
        const lastMsg = conv.messages[conv.messages.length - 1];
        lastMessage = new Message(lastMsg.id, conv.hash, lastMsg.text, lastMsg.from_user_hash, new Date(lastMsg.timestamp),
        lastMsg.status, lastMsg.payload);
        lastMessage.fromSelf = lastMessage.from !== conv.with_user.hash;
        dateModified = new Date(lastMsg.timestamp).getTime();
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
    return new InboxUser(user.id, user.name, user.blocked);
  }

  private buildInboxItem(item) {
    const image: InboxImage = {
      urls_by_size: {
        small: item && item.image_url ? item.image_url : null
      }
    };
    return new InboxItem(item.hash, item.price, item.title, image, item.status);
  }
}
