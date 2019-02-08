import { Injectable } from '@angular/core';
import { HttpService } from '../../core/http/http.service';
import { Observable } from 'rxjs';
import { PersistencyService } from '../../core/persistency/persistency.service';
import { InboxConversation } from '../../core/conversation/conversation';
import { Item } from '../../core/item/item';
import { User } from '../../core/user/user';
import { Message, messageStatus } from '../../core/message/message';

@Injectable()

export class InboxService {

  private str = `
  {
    "user_hash": "mxzorp9np7z9",
    "page": 1,
    "page_size": 1000,
    "conversations": [
    {
    "conversation_hash": "p61y8o5np265",
    "last_message": {
    "message_id": "02E8347D-526B-4042-8AA8-A7F343488D12",
    "from_user_hash": "mxzorp9np7z9",
    "to_user_hash": "7v6gwyklr5ze",
    "text": "Vale gracias",
    "timestamp": "2019-01-28T09:00:20.573038Z"
    },
    "number_of_unread_messages": 3,
    "last_read_sent_timestamp": "2019-01-28T09:00:13.787855Z",
    "last_read_received_timestamp": "2019-01-28T09:05:58.368427Z"
    },
    {
    "conversation_hash": "pzpr20o8l463",
    "last_message": {
    "message_id": "58AC7C92-1441-4D65-A05B-3FF1EABE48E2",
    "from_user_hash": "mxzorp9np7z9",
    "to_user_hash": "xpzp3dpqnk63",
    "text": "Vale perfecto",
    "timestamp": "2019-01-28T08:44:01.571872Z"
    },
    "number_of_unread_messages": 0,
    "last_read_sent_timestamp": "2019-01-28T08:43:48.581939Z",
    "last_read_received_timestamp": "2019-01-27T14:52:24.006958Z"
    },
    {
    "conversation_hash": "qzmym3nq7gzv",
    "last_message": {
    "message_id": "0C2840FB-10A9-4793-B38C-EA7C9B8EDF67",
    "from_user_hash": "mxzorp9np7z9",
    "to_user_hash": "g0j2wmggemjy",
    "text": "Bones, m\u0027interessa la bici, de quin amperatje es la bateria que li falta??",
    "timestamp": "2019-01-27T21:58:13.924516Z"
    }
    }
    ]
   }
  `;
  private mockResponse = JSON.parse(this.str);

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
