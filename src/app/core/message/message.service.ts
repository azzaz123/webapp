import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { MsgArchiveService } from './archive.service';
import { Subject } from 'rxjs/Subject';
import { Conversation } from '../conversation/conversation';
import { Message, messageStatus, phoneRequestState } from './message';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { ConnectionService } from '../connection/connection.service';
import 'rxjs/add/operator/first';
import { EventService } from '../event/event.service';
import { I18nService } from '../i18n/i18n.service';
import { TrackingService } from '../tracking/tracking.service';
import { RealTimeService } from './real-time.service';
import { InboxConversation } from '../../chat/model/inbox-conversation';

@Injectable()
export class MessageService {

  public totalUnreadMessages$: Subject<number> = new Subject<number>();
  private _totalUnreadMessages = 0;

  constructor(private realTime: RealTimeService,
              private archiveService: MsgArchiveService,
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

  public send(conversation: Conversation | InboxConversation, message: string) {
    this.realTime.sendMessage(conversation, message);
  }

  public addPhoneNumberRequestMessage(conversation, withTracking = true): Conversation {
    let msg = new Message(UUID.UUID(),
      conversation.id,
      this.i18n.getTranslations('phoneRequestMessage'),
      conversation.user.id,
      new Date(),
      messageStatus.READ);
    msg = this.addUserInfo(conversation, msg);
    msg.phoneRequest = phoneRequestState.pending;
    conversation.messages.push(msg);
    if (withTracking) {
      this.trackingService.track(TrackingService.CHAT_SHAREPHONE_OPENSHARING);
    }
    conversation.modifiedDate = new Date().getTime();
    return conversation;
  }

  public createPhoneNumberMessage(conversation, phone) {
    const message = this.i18n.getTranslations('phoneMessage') + phone;
    this.realTime.sendMessage(conversation, message);
    const phoneRequestMsg = conversation.messages.find(m => m.phoneRequest);
    phoneRequestMsg.phoneRequest = phoneRequestState.answered;
  }
}
