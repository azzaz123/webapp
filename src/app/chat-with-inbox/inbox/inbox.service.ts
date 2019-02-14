import { Injectable } from '@angular/core';
import { HttpService } from '../../core/http/http.service';
import { Observable } from 'rxjs';
import { PersistencyService } from '../../core/persistency/persistency.service';
import { InboxConversation } from '../../core/conversation/conversation';
import { InboxItem } from '../../core/item/item';
import { InboxUser } from '../../core/user/user';
import { InboxImage } from '../../core/user/user-response.interface';

@Injectable()

export class InboxService {
  private mockResponseUrl = 'assets/json/inbox-projection-data-contract.json';

  constructor(private http: HttpService,
    private persistencyService: PersistencyService) { }

  private API_URL = 'api/v3/instant-messaging/archive/inboxes/mine';

  public getInbox(): Observable<any> {
    return this.http.get(this.API_URL).map(res => {
      const r = res.json();
      return r.conversations.map(conv => {
        return this.buildConversation(conv);
      });
    });
  }

  public saveInbox(inboxData) {
    this.persistencyService.updateInbox(inboxData.conversations);
  }

  private buildConversation(conv): InboxConversation {
    const lastMessage = conv.messages[conv.messages.length - 1];
    lastMessage.fromSelf = lastMessage.from === 'self';
    const user = this.buildInboxUser(conv.with_user);
    const item = this.buildInboxItem(conv.item);
    const dateModified = new Date(lastMessage.timestamp).getTime();
    const conversation = new InboxConversation(conv.conversation_hash, dateModified, user, item, lastMessage,
      conv.messages, conv.unread_messages, conv.phone_shared);
    return conversation;
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
