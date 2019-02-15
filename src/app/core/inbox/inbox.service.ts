import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { PersistencyService } from '../persistency/persistency.service';
import { InboxConversation } from '../conversation/conversation';
import { MessageService } from '../message/message.service';
import { InboxItem } from '../item/item';
import { InboxUser } from '../user/user';
import { InboxImage } from '../user/user-response.interface';

@Injectable()

export class InboxService {
  private API_URL = 'api/v3/instant-messaging/archive/inboxes/mine';
  public conversations$: Subject<InboxConversation[]> = new Subject<InboxConversation[]>();
  public _conversations: InboxConversation[];

  constructor(private http: HttpService,
    private persistencyService: PersistencyService,
    private messageService: MessageService) { console.log('initing service...'); }


  set conversations(value: InboxConversation[]) {
    this._conversations = value;
    this.conversations$.next(value);
  }

  get conversations(): InboxConversation[] {
    return this._conversations;
  }

  public getInbox(): Observable<any> {
    this.messageService.totalUnreadMessages = 0;
    return this.http.get(this.API_URL)
    .map(res => {
      const r = res.json();
      return this.conversations = this.buildConversations(r.conversations);
    });
  }

  public saveInbox(inboxConversations: InboxConversation[]) {
    this.persistencyService.updateInbox(inboxConversations);
  }

  private buildConversations(conversations): InboxConversation[] {
    return conversations.map(conv => {
      const lastMessage = conv.messages[conv.messages.length - 1];
      lastMessage.fromSelf = lastMessage.from === 'self';
      const user = this.buildInboxUser(conv.with_user);
      const item = this.buildInboxItem(conv.item);
      const dateModified = new Date(lastMessage.timestamp).getTime();
      const conversation = new InboxConversation(conv.conversation_hash, dateModified, user, item, lastMessage,
        conv.messages, conv.unread_messages, conv.phone_shared);
      this.messageService.totalUnreadMessages += conversation.unreadCounter;
      return conversation;
    });
  }

  private buildInboxUser(user: any) {
    const r = new InboxUser(user.id, user.name, user.blocked, user.avatar_url, user.location,
      user.scoring, user.response_rate, user.slug);
      return r;
  }

  private buildInboxItem(item) {
    const image: InboxImage = {
      urls_by_size: {
        small: item.image_url
      }
    };
    return new InboxItem(item.hash, item.title, image, item.status);
  }
}
