import { Injectable } from '@angular/core';
import { RealTimeService } from '../message/real-time.service';
import { EventService } from '../event/event.service';
import { ChatSignal, chatSignalType } from '../message/chat-signal.interface';
import { MessageService } from '../message/message.service';
import { PersistencyService } from '../persistency/persistency.service';
import { Message } from '../message/message';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { Response } from '@angular/http';
import { ConversationResponse } from '../conversation/conversation-response.interface';
import { UserService } from '../user/user.service';
import { ItemService } from '../item/item.service';
import { HttpServiceNew } from '../http/http.service.new';
import { InboxConversation } from '../../chat/model/inbox-conversation';
import * as _ from 'lodash';
import { isNullOrUndefined } from 'util';
import { InboxMessage, MessageStatus, MessageType, statusOrder } from '../../chat/model';

@Injectable({
  providedIn: 'root'
})
export class InboxConversationService {
  public static readonly MESSAGES_IN_CONVERSATION = 30;
  private API_URL = 'bff/messaging/conversation/';
  private ARCHIVE_URL = '/api/v3/instant-messaging/conversations/archive';
  private UNARCHIVE_URL = '/api/v3/instant-messaging/conversations/unarchive';
  private MORE_MESSAGES_URL = '/api/v3/instant-messaging/archive/conversation/CONVERSATION_HASH/messages';
  private _selfId: string;

  constructor(
    private http: HttpService,
    private httpClient: HttpServiceNew,
    private realTime: RealTimeService,
    private messageService: MessageService,
    private persistencyService: PersistencyService,
    private eventService: EventService,
    private userService: UserService, // To be removed
    private itemService: ItemService) { // To be removed
  }

  public conversations: InboxConversation[];
  public archivedConversations: InboxConversation[];

  public subscribeChatEvents() {
    this.eventService.subscribe(EventService.INBOX_LOADED, (conversations: InboxConversation[], loadMoreConversations: boolean) => {
      this.conversations = conversations;
    });
    this.eventService.subscribe(EventService.ARCHIVED_INBOX_LOADED, (conversations: InboxConversation[]) => {
      this.archivedConversations = conversations;
    });
    this.eventService.subscribe(EventService.NEW_MESSAGE, (message: Message) => {
      this.processNewMessage(this.buildInboxMessage(message));
    });
    this.eventService.subscribe(EventService.CHAT_SIGNAL, (signal: ChatSignal) => {
      this.processNewChatSignal(signal);
    });
  }

  public buildInboxMessage(message: Message) {
    const messageType = message.payload ? message.payload.type as MessageType : MessageType.TEXT;
    return new InboxMessage(message.id, message.thread, message.message, message.from, message.fromSelf, message.date,
      message.status, messageType, message.payload, message.phoneRequest);
  }

  set selfId(value: string) {
    this._selfId = value;
  }

  public openConversation(conversation: InboxConversation) {
    this.eventService.emit(EventService.CURRENT_CONVERSATION_SET, conversation);
    if (conversation.unreadCounter) {
      this.realTime.sendRead(conversation.user.id, conversation.id);
    }
  }

  public processNewMessage(message: InboxMessage) {
    const existingConversation = this.conversations.find(c => c.id === message.thread);
    const existingArchivedConversation = this.archivedConversations.find(c => c.id === message.thread);
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
    if (!this.findMessage(conversation, message)) {
      conversation.messages.unshift(message);
      conversation.lastMessage = message;
      conversation.modifiedDate = message.date;
      this.bumpConversation(conversation);
      this.persistencyService.saveInboxMessages(message).subscribe(result => {
        this.eventService.emit(EventService.MESSAGE_ADDED, message);
        if (!message.fromSelf) {
          this.incrementUnreadCounter(conversation);
        }
      });
    }
  }

  public sendReceiveSignalByConversations(conversations: InboxConversation[]): void {
    conversations.forEach(conversation => conversation.messages
    .filter(message => message.type === MessageType.TEXT && message.status === MessageStatus.SENT && !message.fromSelf)
    .forEach(message => {
      this.realTime.sendDeliveryReceipt(conversation.user.id, message.id, conversation.id);
      message.status = MessageStatus.RECEIVED;
    }));
  }

  private findMessage(conversation: InboxConversation, message: InboxMessage) {
    return conversation.messages.find(m => m.id === message.id);
  }

  private bumpConversation(conversation: InboxConversation) {
    const index: number = this.conversations.indexOf(conversation);
    if (index > 0) {
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
      case chatSignalType.SENT:
        this.markAs(MessageStatus.SENT, signal.messageId, signal.thread);
        break;
      case chatSignalType.RECEIVED:
        this.markAs(MessageStatus.RECEIVED, signal.messageId, signal.thread);
        break;
      case chatSignalType.READ:
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
        this.persistencyService.updateInboxMessageStatus(message, MessageStatus.READ);
      });
      if (!markMessagesFromSelf) {
        this.messageService.totalUnreadMessages -= conversation.unreadCounter;
        conversation.unreadCounter = 0;
      }
    }
  }

  private markAs(newStatus: string, messageId: string, thread: string) {
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
      this.persistencyService.updateInboxMessageStatus(message, newStatus);
    }
  }

  private fetchOrCreateInboxConversation(message: InboxMessage) {
    this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, false);
    this.getConversation(message.thread)
    .subscribe((conversation) => {
        if (!_.find(this.conversations, { id: conversation.id })) {
          this.conversations.unshift(conversation);
        }
        this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
      },
      (err) => {
        // This is to display incoming messages if for some reason fetching the conversation fails.
        const conversation = InboxConversation.errorConversationFromMessage(message);
        this.conversations.unshift(conversation);
        this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
      });
  }

  private getConversation(id: String): Observable<InboxConversation> {
    return this.http.get(this.API_URL + id)
    .map((res: Response) => InboxConversation.fromJSON(res.json(), this._selfId));
  }

  public containsConversation(conversation: InboxConversation): boolean {
    return isNullOrUndefined(conversation) ? false : _.some(this.conversations, { id: conversation.id });
  }

  public containsArchivedConversation(conversation: InboxConversation): boolean {
    return isNullOrUndefined(conversation) ? false : _.some(this.archivedConversations, { id: conversation.id });
  }

  public archive(conversation: InboxConversation): Observable<InboxConversation> {
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
    return this.http.put(this.ARCHIVE_URL, {
      conversation_ids: [conversationId]
    });
  }

  private unarchiveConversation(conversationId: string): Observable<any> {
    return this.http.put(this.UNARCHIVE_URL, {
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
    .map((res) => {
      const json = res.json();
      const newmessages = InboxMessage.messsagesFromJson(json.messages, conversation.id, this.selfId, conversation.user.id);
      newmessages.forEach((mess) => conversation.messages.push(mess));
      conversation.nextPageToken = json.next_from;
      return conversation;
    });
  }

  private getMoreMessages$(conversationId: string, nextPageToken: string): Observable<any> {
    const url = this.MORE_MESSAGES_URL.replace('CONVERSATION_HASH', conversationId);
    return this.http.get(url,
      {
        max_messages: InboxConversationService.MESSAGES_IN_CONVERSATION,
        from: nextPageToken
      });
  }

  public openConversationByItemId$(itemId: string): Observable<InboxConversation> {
    if (this.conversations && this.archivedConversations) {
      const localConversation = _.find(this.conversations, (conver) => conver.item.id === itemId && !conver.item.isMine)
        || _.find(this.archivedConversations, (conver) => conver.item.id === itemId && !conver.item.isMine);

      if (localConversation) {
        this.openConversation(localConversation);
        return Observable.of(localConversation);
      }

      // Then try to fetch the conversation by item
      return this.fetchConversationByItem$(itemId)
      .map((inboxConversation: InboxConversation) => {
        this.conversations.unshift(inboxConversation);
        this.openConversation(inboxConversation);
        return inboxConversation;
      });
    }
    return Observable.throwError(new Error('Not found'));
  }

  private fetchConversationByItem$(itemId: string): Observable<InboxConversation> {
    return this.httpClient.post<ConversationResponse>('api/v3/conversations', { item_id: itemId })
    .flatMap((response: ConversationResponse) => this.getConversation(response.conversation_id));
  }
}
