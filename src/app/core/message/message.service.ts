import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Subject } from 'rxjs/Subject';
import { Conversation } from '../conversation/conversation';
import { Message, messageStatus, phoneRequestState } from './message';
import { PersistencyService } from '../persistency/persistency.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { ConnectionService } from '../connection/connection.service';
import 'rxjs/add/operator/first';
import { EventService } from '../event/event.service';
import { I18nService } from '../i18n/i18n.service';
import { TrackingService } from '../tracking/tracking.service';
import { RealTimeService } from './real-time.service';
import { InboxConversation } from '../../chat/model/inbox-conversation';
import { InboxMessage, MessageType } from '../../chat/model';

@Injectable()
export class MessageService {

  public totalUnreadMessages$: Subject<number> = new Subject<number>();
  private _totalUnreadMessages = 0;

  constructor(private realTime: RealTimeService,
              private persistencyService: PersistencyService,
              private userService: UserService,
              private connectionService: ConnectionService,
              private i18n: I18nService,
              private trackingService: TrackingService,
              private eventService: EventService) {
  }

  set totalUnreadMessages(value: number) {
    value = Math.max(value, 0);
    this._totalUnreadMessages = value;
    this.totalUnreadMessages$.next(value);
  }

  get totalUnreadMessages(): number {
    return this._totalUnreadMessages;
  }

  public addUserInfoToArray(conversation: Conversation, messages: Message[]): Message[] {
    return messages.map((message) => this.addUserInfo(conversation, message));
  }

  public addUserInfo(conversation: Conversation, message: Message): Message {
    const self: User = this.userService.user;
    const other: User = conversation.user;
    const fromId: string = message.from;
    message.user = (fromId === self.id) ? self : other;
    /* fromSelf: The second part of condition is used to exclude 3rd voice messages, where 'from' = the id of the user
    logged in, but they should not be considered messages fromSelf */
    message.fromSelf = fromId === self.id && !message.payload;
    return message;
  }

  public send(conversation: InboxConversation, message: string) {
    this.realTime.sendMessage(conversation, message);
  }

  public addPhoneNumberRequestMessage(conversation: InboxConversation, withTracking = true): InboxConversation {
    const message = new InboxMessage(UUID.UUID(),
      conversation.id,
      this.i18n.getTranslations('phoneRequestMessage'),
      conversation.user.id,
      true,
      new Date(),
      messageStatus.READ,
      MessageType.TEXT,
      null,
      phoneRequestState.pending);
    conversation.messages.push(message);
    if (withTracking) {
      this.trackingService.addTrackingEvent({ eventData: TrackingService.CHAT_SHAREPHONE_OPENSHARING });
    }
    conversation.modifiedDate = new Date();
    return conversation;
  }

  public createPhoneNumberMessage(conversation, phone) {
    const message = this.i18n.getTranslations('phoneMessage') + phone;
    this.realTime.sendMessage(conversation, message);
  }
}
