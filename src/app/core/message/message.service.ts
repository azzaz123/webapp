import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { MsgArchiveService } from './archive.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Conversation } from '../conversation/conversation';
import { Message, messageStatus } from './message';
import { PersistencyService } from '../persistency/persistency.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { MessagesData, StoredMessageRow, StoredMetaInfoData } from './messages.interface';
import 'rxjs/add/operator/first';
import { ConnectionService } from '../connection/connection.service';
import { MsgArchiveData } from './archive.interface';

@Injectable()
export class MessageService {

  public totalUnreadMessages$: Subject<number> = new Subject<number>();
  private _totalUnreadMessages = 0;

  /* The age (in days) of the messages we want to resend; if there are pending messages that are older than this, we won't resend them; */
  private resendOlderThan = 5;

  constructor(private xmpp: XmppService,
              private archiveService: MsgArchiveService,
              private persistencyService: PersistencyService,
              private userService: UserService,
              private connectionService: ConnectionService) {
  }

  set totalUnreadMessages(value: number) {
    value = value < 0 ? 0 : value;
    this._totalUnreadMessages = value;
    this.totalUnreadMessages$.next(value);
  }

  get totalUnreadMessages(): number {
    return this._totalUnreadMessages;
  }

  public getMessages(conversation: Conversation, total: number = -1, archived?: boolean): Observable<MessagesData> {
    return this.persistencyService.getMessages(conversation.id)
    .flatMap((data: StoredMessageRow[]) => {
      if (data.length) {
        return Observable.of({
          meta: {
            first: data[0].doc._id,
            end: true,
            last: data[data.length - 1].doc._id
          },
          data: data.map((message: any): Message => {
            const msg = new Message(message.doc._id,
              message.doc.conversationId,
              message.doc.message,
              message.doc.from,
              message.doc.date,
              message.doc.status,
              message.doc.payload);

            if (msg.status === messageStatus.PENDING) {
              const timeLimit = new Date().getTime() - (this.resendOlderThan * 24 * 60 * 60 * 1000);
              if (Date.parse(msg.date.toString()) > timeLimit) {
                this.xmpp.sendMessage(conversation, msg.message, true, msg.id);
              }
            }
            return msg;
          })
        });
      } else if (this.connectionService.isConnected) {
        return this.queryMessagesByThread(conversation.id).map(r => {
          if (r.messages.length) {
            if (archived) {
              r.messages.map(m => m.status = messageStatus.READ);
      }
            this.persistencyService.saveMessages(r.messages);
            this.persistencyService.saveMetaInformation({
              last: _.last(r.messages).id,
              start: (_.last(r.messages)).date.toISOString()
            });
            this.addClickstreamEvents(r, conversation.item.id);
            this.confirmUnconfirmedMessages(r.messages, r.receivedReceipts);
          }
          return r;
        });
      }
    })
    .map((res: any) => {
      return {
        meta: res.meta,
        data: this.addUserInfoToArray(conversation, res.data ? res.data : res.messages)
      };
    });
  }

  private addClickstreamEvents(archiveData: MsgArchiveData, itemId) {
    archiveData.messages.filter(message => !message.fromSelf).map(message => {
      const msgAlreadyConfirmed = archiveData.receivedReceipts.find(receipt => receipt.messageId === message.id);
      if (!msgAlreadyConfirmed) {
        const trackReceivedAckEvent: TrackingEventData = {
          eventData: TrackingService.MESSAGE_RECEIVED_ACK,
          attributes: {
            thread_id: message.conversationId,
            message_id: message.id,
            item_id: itemId
          }
        };
        this.trackingService.pendingTrackingEvents.push(trackReceivedAckEvent);
      }
    });

    archiveData.messages.filter(message => message.fromSelf).map(message => {
      const attributes = {
        thread_id: message.conversationId,
        message_id: message.id,
        item_id: itemId
      };

      switch (message.status) {
        case messageStatus.READ:
        this.trackingService.pendingTrackingEvents.push({eventData: TrackingService.MESSAGE_SENT_ACK, attributes: attributes});
          this.trackingService.pendingTrackingEvents.push({eventData: TrackingService.MESSAGE_RECEIVED, attributes: attributes});
          this.trackingService.pendingTrackingEvents.push({eventData: TrackingService.MESSAGE_READ, attributes: attributes});
          break;
        case messageStatus.RECEIVED:
          this.trackingService.pendingTrackingEvents.push({eventData: TrackingService.MESSAGE_SENT_ACK, attributes: attributes});
          this.trackingService.pendingTrackingEvents.push({eventData: TrackingService.MESSAGE_RECEIVED, attributes: attributes});
          break;
        case messageStatus.SENT:
        this.trackingService.pendingTrackingEvents.push({eventData: TrackingService.MESSAGE_SENT_ACK, attributes: attributes});
        break;
      }
    });
  }

  private confirmUnconfirmedMessages(messages: Array<any>, receivedReceipts: Array<any>) {
    messages.filter(message => !message.fromSelf).map(message => {
      const msgAlreadyConfirmed = receivedReceipts.find(receipt => receipt.messageId === message.id);
      if (!msgAlreadyConfirmed) {
        this.xmpp.sendMessageDeliveryReceipt(message.from, message.id, message.conversationId);
      }
    });
  }
  public getNotSavedMessages(): Observable<MsgArchiveData> {
    if (this.connectionService.isConnected) {
      return this.persistencyService.getMetaInformation().flatMap((resp: StoredMetaInfoData) => {
        return this.queryMessages(resp.data.start);
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
    message.fromSelf = fromId === self.id;
    return message;
  }

  public send(conversation: Conversation, message: string) {
    this.xmpp.sendMessage(conversation, message);
  }

  public queryMessages(since: string): Observable<any> {
    const nanoTimestamp = since && since !== '0' ? (new Date(since).getTime() / 1000) + '000' : null;
    return this.archiveService.getEventsSince(nanoTimestamp);
  }

  public queryMessagesByThread(thread: string, since?: string): Observable<any> {
    const nanoTimestamp = since ? (new Date(since).getTime() / 1000) + '000' : null;
    return this.archiveService.getAllEvents(thread, nanoTimestamp);
  }

  public resetCache() {
    this.totalUnreadMessages = 0;
  }

}
