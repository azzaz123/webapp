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

@Injectable()

export class InboxService {
  private API_URL = 'api/v3/instant-messaging/archive/inboxes/mine';
  public _conversations: InboxConversation[];

  constructor(private http: HttpService,
    private persistencyService: PersistencyService,
    private messageService: MessageService,
    private featureflagService: FeatureflagService) {}


  set conversations(value: InboxConversation[]) {
    this._conversations = value;
  }

  get conversations(): InboxConversation[] {
    return this._conversations;
  }

  public getInboxFeatureFlag(): Observable<boolean> {
    return this.featureflagService.getFlag('web_inbox_projections');
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
      let lastMessage = null;
      let dateModified = null;
      if (conv.messages && conv.messages.length) {
        lastMessage = conv.messages[conv.messages.length - 1];
        lastMessage.fromSelf = lastMessage.from !== conv.with_user.hash;
        dateModified = new Date(lastMessage.timestamp).getTime();
      }
      const user = this.buildInboxUser(conv.with_user);
      const item = this.buildInboxItem(conv.item);
      const conversation = new InboxConversation(conv.conversation_hash, dateModified, user, item, lastMessage,
        conv.messages, conv.unread_messages || 0, conv.phone_shared);
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
