import { Injectable, NgZone } from '@angular/core';
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

  public getConversation(itemId): Observable<any> {
    return this.http.get(`shm-portlet/api/v1/item.json/${itemId}/conversation`);
  }

}
