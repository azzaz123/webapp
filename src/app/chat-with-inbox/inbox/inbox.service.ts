import { Injectable } from '@angular/core';
import { HttpService } from '../../core/http/http.service';
import { Observable } from 'rxjs';
import { PersistencyService } from '../../core/persistency/persistency.service';
import { InboxConversation } from '../../core/conversation/conversation';
import { InboxItem } from '../../core/item/item';
import { User } from '../../core/user/user';
import { Message, messageStatus } from '../../core/message/message';

@Injectable()

export class InboxService {
  private mockResponseUrl = 'assets/json/inbox-projection-data-contract.json';

  constructor(private http: HttpService,
    private persistencyService: PersistencyService) { }

  private API_URL = 'api/v3/instant-messaging/archive/inboxes/mine';

  public getInbox(): Observable<any> {
    console.log('getting!');
    // return Observable.of(this.mockResponse).map(r => {
    //   console.log(r.conversations);
    //   this.saveInbox(r);
    //   return r.conversations.map(conv => {
    //     return this.buildConversation(conv);
    //   });
    // });
    return this.http.get(this.API_URL);
  }

  public saveInbox(inboxData) {
    this.persistencyService.updateInbox(inboxData.conversations);
  }

  private buildConversation(conv): InboxConversation {
    console.log(conv);
    const user = new User(conv.from_user_hash);
    user.blocked = false;
    const dateModified = new Date(conv.last_message.timestamp).getTime();
    const item = new Item('abc', 123, conv.from_user_hash);
    const conversation = new InboxConversation(conv.conversation_hash, dateModified, user, item, conv.last_message, [],
      conv.number_of_unread_messages);
    return conversation;
  }
}
