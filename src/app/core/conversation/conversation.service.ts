import { Injectable, NgZone } from '@angular/core';
import { Headers, Response } from '@angular/http';

import {
  ConversationService as ConversationServiceMaster,
  UserService,
  ItemService,
  EventService,
  HttpService,
  ShieldConfig,
  XmppService,
  PersistencyService,
  MessageService,
  TrackingService,
  NotificationService
} from 'shield';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';
import { NewConversationResponse } from 'shield/lib/shield/conversation/conversation-response.interface';

@Injectable()
export class ConversationService extends ConversationServiceMaster {

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

  public getConversation(itemId): Observable<NewConversationResponse> {
    return this.http.get(`api/v3/items/${itemId}/conversation`).map((r: Response) => {
      return r.json();
    });
  }

  public createConversation(itemId): Observable<NewConversationResponse> {
    const options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json');
    return this.http.post(`api/v3/conversations`, JSON.stringify({item_id: itemId}), options).map((r: Response) => {
      return r.json();
    });
  }

}
