import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { XmppService } from '../xmpp/xmpp.service';
import { MsgArchiveService } from './archive.service';
import { Observable } from 'rxjs/Observable';
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

@Injectable()
export class MessageService {

  public totalUnreadMessages$: Subject<number> = new Subject<number>();
  private _totalUnreadMessages = 0;
  private allMessages = [];

  /* The age (in days) of the messages we want to resend; if there are pending messages that are older than this, we won't resend them; */
  private resendOlderThan = 5;

  constructor(private xmpp: XmppService,
              private archiveService: MsgArchiveService,
              private persistencyService: PersistencyService,
              private userService: UserService,
              private connectionService: ConnectionService,
              private i18n: I18nService,
              private trackingService: TrackingService,
              private eventService: EventService) {
  }

  set totalUnreadMessages(value: number) {
    value = value < 0 ? 0 : value;
    this._totalUnreadMessages = value;
    this.totalUnreadMessages$.next(value);
  }

  get totalUnreadMessages(): number {
    return this._totalUnreadMessages;
  }

  public getMessages(conversation: Conversation, firstArchive: boolean = false): Observable<MessagesData> {
    return this.persistencyService.getMessages(conversation.id)
    .flatMap((messages: StoredMessageRow[]) => {
      if (messages.length) {
        this.eventService.emit(EventService.FOUND_MESSAGES_IN_DB);
        const res: MsgArchiveResponse = {
          messages: messages.map((message: any): Message => {
            const msg = new Message(message.doc._id,
              message.doc.conversationId,
              message.doc.message,
              message.doc.from,
              message.doc.date,
              message.doc.status,
              message.doc.payload,
              message.doc.phoneRequest);

            if (msg.status === messageStatus.PENDING) {
              const timeLimit = new Date().getTime() - (this.resendOlderThan * 24 * 60 * 60 * 1000);
              if (Date.parse(msg.date.toString()) > timeLimit) {
                this.xmpp.sendMessage(conversation, msg.message, true, msg.id);
              }
            }
            this.allMessages.push(msg);
            return msg;
          })
        };
        return Observable.of(res);
      } else if (this.connectionService.isConnected) {
        if (firstArchive) {
          this.eventService.emit(EventService.MSG_ARCHIVE_LOADING);
        }
        return this.archiveService.getAllEvents(conversation.id).map(r => {
          this.persistencyService.saveMetaInformation({start: r.metaDate, last: null});
          if (r.messages.length) {
            r = this.confirmAndSaveMessagesByThread(r, conversation.archived);
          }
          return r;
        });
      }
    })
    .map((res: any) => {
      return {
        data: this.addUserInfoToArray(conversation, res.messages)
      };
    });
  }

  private confirmAndSaveMessagesByThread(r: MsgArchiveResponse, archived: boolean): MsgArchiveResponse {
    if (archived) {
      r.messages.filter(m => !m.fromSelf).map(m => m.status = messageStatus.READ);
    }
    this.confirmUnconfirmedMessages(r.messages, r.receivedReceipts);
    this.persistencyService.saveMessages(r.messages);
    return r;
  }

  private confirmUnconfirmedMessages(messages: Array<Message>, receivedReceipts: Array<ReceivedReceipt>) {
    messages.filter(message => !message.fromSelf).map(message => {
      const msgAlreadyConfirmed = receivedReceipts.find(receipt => receipt.messageId === message.id);
      if (!msgAlreadyConfirmed) {
        this.xmpp.sendMessageDeliveryReceipt(message.from, message.id, message.conversationId);
      }
    });
  }

  public getNotSavedMessages(conversations: Conversation[], archived: boolean): Observable<Conversation[]> {
    if (this.connectionService.isConnected) {
      return this.persistencyService.getMetaInformation().flatMap((resp: StoredMetaInfoData) => {
        this.eventService.emit(EventService.MSG_ARCHIVE_LOADING);
        return this.archiveService.getEventsSince(resp.data.start).map(r => {
          this.persistencyService.saveMetaInformation({ start: r.metaDate, last: null });
          if (r.messages.length) {
            const messagesByThread = _.groupBy(r.messages, 'conversationId');
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
            updatedMesages.map(m => this.persistencyService.updateMessageStatus(m, m.status));

            if (!archived) {
              this.totalUnreadMessages = 0;
            }

            const updateMessagesByThread = _.groupBy(updatedMesages, 'conversationId');
            Object.keys(updateMessagesByThread).map((thread) => {
              const unreadCount = updateMessagesByThread[thread].filter(m => !m.fromSelf && m.status !== messageStatus.READ).length;
              const conv = conversations.find(c => c.id === thread);
              if (conv && !conv.archived) {
                conv.unreadMessages = unreadCount;
                this.totalUnreadMessages += unreadCount;
              }
            });
          }
          this.eventService.emit(EventService.MSG_ARCHIVE_LOADED);
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
    const fromId: string = message.from.split('@')[0];
    message.user = (fromId === self.id) ? self : other;
    /* fromSelf: The second part of condition is used to exclude 3rd voice messages, where 'from' = the id of the user
    logged in, but they should not be considered messages fromSelf */
    message.fromSelf = fromId === self.id && !message.payload;
    return message;
  }

  public send(conversation: Conversation, message: string) {
    this.xmpp.sendMessage(conversation, message);
  }

  public addPhoneNumberRequestMessage(conversation, withTracking = true): Conversation {
    this.eventService.subscribe(EventService.CONVERSATION_CEATED, (conv, message) => {
      if (conversation.id === conv.id) {
        this.persistencyService.saveMessages([message]);
      }
    });
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
    this.xmpp.sendMessage(conversation, message);
    const phoneRequestMsg = conversation.messages.find(m => m.phoneRequest);
    phoneRequestMsg.phoneRequest = phoneRequestState.answered;
    this.persistencyService.markPhoneRequestAnswered(phoneRequestMsg);
    this.persistencyService.setPhoneNumber(phone);
  }

  public resetCache() {
    this.totalUnreadMessages = 0;
  }

}
