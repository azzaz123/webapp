import { Injectable } from '@angular/core';
import { RealTimeService } from '../../core/message/real-time.service';
import { EventService } from '../../core/event/event.service';
import { ChatSignal, ChatSignalType } from '../model/chat-signal';
import { MessageService } from './message.service';
import { PersistencyService } from '../../core/persistency/persistency.service';
import { Observable, of } from 'rxjs';
import { ConversationResponse } from '../../core/conversation/conversation-response.interface';
import { InboxConversation, InboxMessage, MessageStatus, MessageType, statusOrder } from '../model';
import { find, head, isEmpty, isNil, some } from 'lodash-es';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { InboxConversationApi, InboxMessagesApi } from '../model/api';

@Injectable({
  providedIn: 'root'
})
export class InboxConversationService {
  public static readonly RESEND_BEFORE_5_DAYS = 5;
  public static readonly MESSAGES_IN_CONVERSATION = 30;

  private API_URL = 'bff/messaging/conversation/';
  private ARCHIVE_URL = 'api/v3/instant-messaging/conversations/archive';
  private UNARCHIVE_URL = 'api/v3/instant-messaging/conversations/unarchive';

  private _selfId: string;

  public currentConversation: InboxConversation;

  public conversations: InboxConversation[];
  public archivedConversations: InboxConversation[];

  constructor(
    private httpClient: HttpClient,
    private realTime: RealTimeService,
    private messageService: MessageService,
    private persistencyService: PersistencyService,
    private eventService: EventService) {
    this.conversations = [];
    this.archivedConversations = [];
    this.currentConversation = null;
  }

  public subscribeChatEvents() {
    this.eventService.subscribe(EventService.NEW_MESSAGE, (message: InboxMessage) => {
      this.processNewMessage(message);
    });
    this.eventService.subscribe(EventService.CHAT_SIGNAL, (signal: ChatSignal) => {
      this.processNewChatSignal(signal);
    });
  }

  set selfId(value: string) {
    this._selfId = value;
  }

  public openConversation(conversation: InboxConversation) {
    this.resendPendingMessages(conversation);
    this.eventService.emit(EventService.CURRENT_CONVERSATION_SET, conversation);
    if (conversation.unreadCounter) {
      this.realTime.sendRead(conversation.user.id, conversation.id);
    }
  }

  public processNewMessage(message: InboxMessage) {
    const existingConversation = this.conversations.find((conversation: InboxConversation) => conversation.id === message.thread);
    const existingArchivedConversation = this.archivedConversations
    .find((conversation: InboxConversation) => conversation.id === message.thread);
    if (existingConversation) {
      this.addNewMessage(existingConversation, message);
    } else if (existingArchivedConversation) {
      this.addNewMessage(existingArchivedConversation, message);
      this.eventService.emit(EventService.CONVERSATION_UNARCHIVED, existingArchivedConversation);
    } else {
      this.fetchOrCreateInboxConversation(message);
    }
  }

  private addNewMessage(conversation: InboxConversation, message: InboxMessage) {
    if (isEmpty(conversation.messages)) {
      conversation.messages = [];
    }
    if (!this.findMessage(conversation, message)) {
      conversation.messages.unshift(message);
      conversation.lastMessage = message;
      conversation.modifiedDate = message.date;
      this.bumpConversation(conversation);

      if (this.currentConversation !== null
        && this.currentConversation.id === conversation.id
        && isEmpty(this.currentConversation.messages)) {
        this.currentConversation = conversation;
      }

      this.eventService.emit(EventService.MESSAGE_ADDED, message);
      if (!message.fromSelf) {
        this.incrementUnreadCounter(conversation);
      }

      if (!message.fromSelf) {
        this.realTime.sendDeliveryReceipt(message.from, message.id, message.thread);
      }
    }
  }

  public sendReceiveSignalByConversations(conversations: InboxConversation[]): void {
    conversations.forEach(conversation => (conversation.messages || [])
    .filter(message => message.type === MessageType.TEXT && message.status === MessageStatus.SENT && !message.fromSelf)
    .forEach(message => {
      this.realTime.sendDeliveryReceipt(conversation.user.id, message.id, conversation.id);
      message.status = MessageStatus.RECEIVED;
    }));
  }

  public sendReadSignal(conversation: InboxConversation): void {
    this.realTime.sendRead(conversation.user.id, conversation.id);
  }

  private findMessage(conversation: InboxConversation, message: InboxMessage) {
    return conversation.messages.find(m => m.id === message.id);
  }

  private bumpConversation(conversation: InboxConversation) {
    if (this.containsConversation(conversation)) {
      const index: number = this.conversations.indexOf(conversation);
      this.conversations.splice(index, 1);
      this.conversations.unshift(conversation);
    }
  }

  private incrementUnreadCounter(existingConversation: InboxConversation) {
    existingConversation.unreadCounter++;
    this.messageService.totalUnreadMessages++;
  }

  public processNewChatSignal(signal: ChatSignal) {
    switch (signal.type) {
      case ChatSignalType.SENT:
        this.markAs(MessageStatus.SENT, signal.messageId, signal.thread);
        break;
      case ChatSignalType.RECEIVED:
        this.markAs(MessageStatus.RECEIVED, signal.messageId, signal.thread);
        break;
      case ChatSignalType.READ:
        /* the last argument passed to markAllAsRead is the reverse of fromSelf, as markAllAsRead method uses it to filter which messages
           it should mark with status 'read'; when receiving a READ signal fromSelf we want to mark as 'read' messages from other */
        this.markAllAsRead(signal.thread, signal.timestamp, !signal.fromSelf);
        break;
      default:
        break;
    }
  }

  private markAllAsRead(thread: string, timestamp?: number, markMessagesFromSelf: boolean = false) {
    const conversation = this.conversations.find(c => c.id === thread);
    if (conversation) {
      const unreadMessages = conversation.messages.filter(message => (message.status === MessageStatus.RECEIVED ||
        message.status === MessageStatus.SENT) && (markMessagesFromSelf ? message.fromSelf &&
        new Date(message.date).getTime() <= timestamp : !message.fromSelf));
      unreadMessages.map((message) => {
        message.status = MessageStatus.READ;
      });
      if (!markMessagesFromSelf) {
        this.messageService.totalUnreadMessages -= conversation.unreadCounter;
        conversation.unreadCounter = 0;
      }
    }
  }

  private markAs(newStatus: MessageStatus, messageId: string, thread: string) {
    const conversation = this.conversations.find(c => c.id === thread);
    if (!conversation) {
      return;
    }
    const message = conversation.messages.find(m => m.id === messageId);
    if (!message) {
      return;
    }

    if (!message.status || statusOrder.indexOf(newStatus) > statusOrder.indexOf(message.status) || message.status === null) {
      message.status = newStatus;
    }
  }

  private fetchOrCreateInboxConversation(message: InboxMessage) {
    this.getConversation(message.thread)
    .subscribe((conversation: InboxConversation) => {
        if (!this.containsConversation(conversation)) {
          this.sendReceiveSignalByConversations([conversation]);
          this.conversations.unshift(conversation);
        }
      },
      (err) => {
        // This is to display incoming messages if for some reason fetching the conversation fails.
        const conversation = InboxConversation.errorConversationFromMessage(message);
        if (!this.containsConversation(conversation)) {
          this.conversations.unshift(conversation);
        }
      });
  }

  public getConversation(id: String): Observable<InboxConversation> {
    return this.httpClient.get<InboxConversationApi>(`${environment.baseUrl}${this.API_URL}${id}`)
    .map((conversationResponse: InboxConversationApi) => InboxConversation.fromJSON(conversationResponse, this._selfId));
  }

  public containsConversation(conversation: InboxConversation): boolean {
    return isNil(conversation) ? false : some(this.conversations, { id: conversation.id });
  }

  public containsArchivedConversation(conversation: InboxConversation): boolean {
    return isNil(conversation) ? false : some(this.archivedConversations, { id: conversation.id });
  }

  public archive$(conversation: InboxConversation): Observable<InboxConversation> {
    return this.archiveConversation(conversation.id)
    .catch((err) => {
      if (err.status === 409) {
        return Observable.of(conversation);
      } else {
        return Observable.throwError(err);
      }
    })
    .map(() => {
      this.eventService.emit(EventService.CONVERSATION_ARCHIVED, conversation);
      return conversation;
    });
  }

  public unarchive(conversation: InboxConversation): Observable<InboxConversation> {
    return this.unarchiveConversation(conversation.id)
    .catch((err) => {
      if (err.status === 409) {
        return Observable.of(conversation);
      } else {
        return Observable.throwError(err);
      }
    })
    .map(() => {
      this.eventService.emit(EventService.CONVERSATION_UNARCHIVED, conversation);
      return conversation;
    });
  }

  private archiveConversation(conversationId: string): Observable<any> {
    return this.httpClient.put<any>(`${environment.baseUrl}${this.ARCHIVE_URL}`, {
      conversation_ids: [conversationId]
    });
  }

  private unarchiveConversation(conversationId: string): Observable<any> {
    return this.httpClient.put<any>(`${environment.baseUrl}${this.UNARCHIVE_URL}`, {
      conversation_ids: [conversationId]
    });
  }

  public loadMoreMessages(conversationId: string) {
    let conversation = this.conversations.find((conver) => conver.id === conversationId);
    if (!conversation) {
      conversation = this.archivedConversations.find((conver) => conver.id === conversationId);
    }

    if (conversation) {
      this.loadMoreMessagesFor$(conversation)
      .subscribe((conv: InboxConversation) => {
        this.eventService.emit(EventService.MORE_MESSAGES_LOADED, conv);
      });
    }
  }

  private loadMoreMessagesFor$(conversation: InboxConversation): Observable<InboxConversation> {
    return this.getMoreMessages$(conversation.id, conversation.nextPageToken).delay(1000)
    .map((messagesResponse: InboxMessagesApi) => {
      const inboxMessages = InboxMessage.messsagesFromJson(messagesResponse.messages, conversation.id, this.selfId, conversation.user.id);
      inboxMessages.forEach((mess) => conversation.messages.push(mess));
      conversation.nextPageToken = messagesResponse.next_from;
      return conversation;
    });
  }

  private getMoreMessages$(conversationId: string, nextPageToken: string): Observable<InboxMessagesApi> {
    return this.httpClient.get<InboxMessagesApi>(
      `${environment.baseUrl}api/v3/instant-messaging/archive/conversation/${conversationId}/messages`, {
        params: {
          max_messages: InboxConversationService.MESSAGES_IN_CONVERSATION.toString(),
          from: nextPageToken
        }
      });
  }

  public openConversationByConversationId$(conversationId: string): Observable<InboxConversation> {
    if (this.conversations === null || this.conversations === undefined) {
      return of(null);
    }
    return of(head(this.conversations.filter(conversation => conversation.id === conversationId)));
  }

  public openConversationByItemId$(itemId: string): Observable<InboxConversation> {
    if (this.conversations && this.archivedConversations) {
      const localConversation = find(this.conversations, (conversation) => conversation.item.id === itemId)
        || find(this.archivedConversations, (conversation) => conversation.item.id === itemId);

      if (localConversation) {
        this.openConversation(localConversation);
        return Observable.of(localConversation);
      }

      return this.fetchConversationByItem$(itemId)
      .map((inboxConversation: InboxConversation) => {
        if (!this.containsConversation(inboxConversation)) {
          this.conversations.unshift(inboxConversation);
        }
        this.openConversation(inboxConversation);
        return inboxConversation;
      });
    }
    return Observable.throwError(new Error('Not found'));
  }

  private fetchConversationByItem$(itemId: string): Observable<InboxConversation> {
    return this.httpClient.post<ConversationResponse>(`${environment.baseUrl}api/v3/conversations`, { item_id: itemId })
    .flatMap((response: ConversationResponse) => this.getConversation(response.conversation_id));
  }

  public resendPendingMessages(conversation: InboxConversation): void {
    conversation.messages
    .filter((message: InboxMessage) => message.status === MessageStatus.PENDING
      && moment(message.date).isAfter(moment().subtract(InboxConversationService.RESEND_BEFORE_5_DAYS, 'days')))
    .forEach((message: InboxMessage) => this.realTime.resendMessage(conversation, message));
  }
}
