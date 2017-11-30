import { Injectable, NgZone } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';

import {
  Conversation,
  ConversationResponse,
  ConversationService as ConversationServiceMaster,
  EventService,
  HttpService,
  ItemService,
  MessagesData,
  MessageService,
  NewConversationResponse,
  NotificationService,
  PersistencyService,
  ShieldConfig,
  UserService,
  XmppService
} from 'shield';
import { Observable } from 'rxjs/Observable';
import { TrackingService } from '../tracking/tracking.service';

@Injectable()
export class ConversationService extends ConversationServiceMaster {

  protected API_URL = 'api/v3/conversations';
  protected ARCHIVE_URL = 'api/v3/conversations';

  constructor(http: HttpService,
              userService: UserService,
              itemService: ItemService,
              event: EventService,
              config: ShieldConfig,
              xmpp: XmppService,
              persistencyService: PersistencyService,
              messageService: MessageService,
              trackingService: TrackingService,
              notificationService: NotificationService,
              zone: NgZone) {
    super(http, userService, itemService, event, config, xmpp,
      persistencyService, messageService, trackingService, notificationService, zone);

  }

  public getByItemId(itemId): Observable<NewConversationResponse> {
    return this.http.get(`api/v3/items/${itemId}/conversation`).map((r: Response) => {
      return r.json();
    });
  }

  public createConversation(itemId): Observable<Conversation> {
    const options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json');
    return this.http.post(`api/v3/conversations`, JSON.stringify({item_id: itemId}), options).flatMap((r: Response) => {
      const response: ConversationResponse = r.json();
      return Observable.forkJoin(
        this.userService.get(response.other_user_id),
        this.itemService.get(itemId)
      ).map((data: any) => {
        return new Conversation(
          response.conversation_id,
          null,
          response.modified_date,
          false,
          data[0],
          data[1]);
      });
    });
  }

  getSingleConversationMessages(conversation: Conversation) {
    return this.messageService.getMessages(conversation).map((data: MessagesData) => {
      conversation.messages = data.data;
      return conversation;
    });
  }

}
