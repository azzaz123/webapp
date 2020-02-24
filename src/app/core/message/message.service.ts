import { groupBy } from 'lodash-es';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';
import { MsgArchiveService } from './archive.service';
import { Subject } from 'rxjs/Subject';
import { Conversation } from '../conversation/conversation';
import { Message, messageStatus, phoneRequestState } from './message';
import { PersistencyService } from '../persistency/persistency.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { MessagesData, StoredMessageRow, StoredMetaInfoData } from './messages.interface';
import { ConnectionService } from '../connection/connection.service';
import { MsgArchiveResponse, ReceivedReceipt } from './archive.interface';
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
  private allMessages = [];

  constructor(private realTime: RealTimeService,
              private archiveService: MsgArchiveService,
              private persistencyService: PersistencyService,
              private userService: UserService,
              private connectionService: ConnectionService,
              private i18n: I18nService,
              private trackingService: TrackingService,
              private eventService: EventService) {
  }

  set totalUnreadMessages(value: number) {
    value = Math.max(value , 0);
    this._totalUnreadMessages = value;
    this.totalUnreadMessages$.next(value);
  }

  get totalUnreadMessages(): number {
    return this._totalUnreadMessages;
  }

  public getMessages(conversation: Conversation, firstArchive: boolean = false): Observable<MessagesData> {
    const response: MessagesData = {
      data: []
    };
    return Observable.of(response);
  }

  private confirmAndSaveMessagesByThread(r: MsgArchiveResponse, archived: boolean): MsgArchiveResponse {
    if (archived) {
      r.messages.filter(m => !m.fromSelf).map(m => m.status = messageStatus.READ);
    }
    return r;
  }

  public getNotSavedMessages(conversations: Conversation[], archived: boolean): Observable<Conversation[]> {
    if (this.connectionService.isConnected) {
      return this.persistencyService.getMetaInformation().flatMap((resp: StoredMetaInfoData) => {
        this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, false);
        return this.archiveService.getEventsSince(resp.data.start).map(r => {
          this.persistencyService.saveMetaInformation({ start: r.metaDate, last: null });
          if (r.messages.length) {
            const messagesByThread = groupBy(r.messages, 'thread');
            Object.keys(messagesByThread).map((thread) => {
              const msgAndSingalsForThread = {
                messages: messagesByThread[thread],
                receivedReceipts: r.receivedReceipts.filter(rec => rec.thread === thread),
                readReceipts: r.readReceipts.filter(rec => rec.thread === thread),
                metaDate: r.metaDate
              };
              const conversation = conversations.find(c => c.id === thread);
              if (conversation) {
                this.confirmAndSaveMessagesByThread(msgAndSingalsForThread, conversation.archived);
                messagesByThread[thread].map(msg => {
                  if (!(conversation.messages).find(m => m.id === msg.id)) {
                    msg = this.addUserInfo(conversation, msg);
                    conversation.messages.push(msg);
                    this.allMessages.push(msg);
                  }
                });
              }
            });
          }

          if (r.readReceipts.length || r.receivedReceipts.length) {
            let updatedMesages = [];
            updatedMesages = this.archiveService.updateStatuses(this.allMessages, r.readReceipts, r.receivedReceipts);

            if (!archived) {
              this.totalUnreadMessages = 0;
            }

            const updateMessagesByThread = groupBy(updatedMesages, 'thread');
            Object.keys(updateMessagesByThread).map((thread) => {
              const unreadCount = updateMessagesByThread[thread].filter(m => !m.fromSelf && m.status !== messageStatus.READ).length;
              const conv = conversations.find(c => c.id === thread);
              if (conv && !conv.archived) {
                conv.unreadMessages = unreadCount;
                this.totalUnreadMessages += unreadCount;
              }
            });
          }
          this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
          return conversations;
        });
      });
    }
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
      this.trackingService.addTrackingEvent({ eventData: TrackingService.CHAT_SHAREPHONE_OPENSHARING });
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

  public resetCache() {
    this.totalUnreadMessages = 0;
  }

}
