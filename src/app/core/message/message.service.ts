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
import { MessagesData, StoredMessageRow, StoredMetaInfo } from './messages.interface';
import { ConnectionService } from '../connection/connection.service';
import { MsgArchiveResponse, ReceivedReceipt } from './archive.interface';
import 'rxjs/add/operator/first';
import { EventService } from '../event/event.service';

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

  public getMessages(conversation: Conversation, archived?: boolean): Observable<MessagesData> {
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
              message.doc.payload);

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
        return this.queryMessagesByThread(conversation.id, '0').map(r => {
          r = this.confirmAndSaveMessages(r, conversation.archived);
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

  private addClickstreamEvents(archiveData: MsgArchiveResponse, itemId: string) {
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
        this.trackingService.addTrackingEvent(trackReceivedAckEvent, false);
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
          this.trackingService.addTrackingEvent({eventData: TrackingService.MESSAGE_SENT_ACK, attributes: attributes}, false);
          this.trackingService.addTrackingEvent({eventData: TrackingService.MESSAGE_RECEIVED, attributes: attributes}, false);
          this.trackingService.addTrackingEvent({eventData: TrackingService.MESSAGE_READ, attributes: attributes}, false);
          break;
        case messageStatus.RECEIVED:
          this.trackingService.addTrackingEvent({eventData: TrackingService.MESSAGE_SENT_ACK, attributes: attributes}, false);
          this.trackingService.addTrackingEvent({eventData: TrackingService.MESSAGE_RECEIVED, attributes: attributes}, false);
          break;
        case messageStatus.SENT:
          this.trackingService.addTrackingEvent({eventData: TrackingService.MESSAGE_SENT_ACK, attributes: attributes}, false);
          break;
      }
    });
  }

  private confirmUnconfirmedMessages(messages: Array<Message>, receivedReceipts: Array<ReceivedReceipt>) {
    messages.filter(message => !message.fromSelf).map(message => {
      const msgAlreadyConfirmed = receivedReceipts.find(receipt => receipt.messageId === message.id);
      if (!msgAlreadyConfirmed) {
        this.xmpp.sendMessageDeliveryReceipt(message.from, message.id, message.conversationId);
      }
    });
  }

  public getNotSavedMessages(conversations: Conversation[]): Observable<Conversation[]> {
    return this.persistencyService.getMetaInformation().flatMap((resp: StoredMetaInfo) => {
        return this.archiveService.getEventsSince(resp.start).map(r => {
        r.messages.map(msg => {
          const conversation = conversations.find(c => c.id === msg.conversationId);
          if (conversation) {
            if (!(conversation.messages).find(m => m.id === msg.id)) {
              msg = this.addUserInfo(conversation, msg);
              conversation.messages.push(msg);
              this.allMessages.push(msg);
            }
          }
        });

        if (r.readReceipts.length || r.receivedReceipts.length) {
          this.totalUnreadMessages = 0;
          let updatedMesages = [];
          updatedMesages = this.archiveService.updateStatuses(this.allMessages, r.readReceipts, r.receivedReceipts);
          updatedMesages.map(m => this.persistencyService.updateMessageStatus(m, m.status));

          const updateMessagesByThread = _.groupBy(updatedMesages, 'conversationId');
          Object.keys(updateMessagesByThread).map((thread) => {
            const unreadCount = updateMessagesByThread[thread].filter(m => m.status !== messageStatus.READ && !m.fromSelf).length;
            const conv = conversations.find(c => c.id === thread);
            if (conv) {
              conv.unreadMessages = unreadCount;
              this.totalUnreadMessages += unreadCount;
            }
      });
    }
        r = this.confirmAndSaveMessages(r);
        return conversations;
      });
    });
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

  private queryMessagesByThread(thread: string, since: string): Observable<MsgArchiveResponse> {
    return this.archiveService.getAllEvents(thread, since);
  }

  public resetCache() {
    this.totalUnreadMessages = 0;
  }

}
