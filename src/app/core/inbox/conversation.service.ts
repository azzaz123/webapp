import { Injectable } from '@angular/core';
import { RealTimeService } from '../message/real-time.service';
import { InboxConversation } from '../../chat/chat-with-inbox/inbox/inbox-conversation/inbox-conversation';
import { EventService } from '../event/event.service';
import { InboxMessage, messageStatus, statusOrder } from '../../chat/chat-with-inbox/message/inbox-message';
import { ChatSignal, chatSignalType } from '../message/chat-signal.interface';
import { MessageService } from '../message/message.service';
import { PersistencyService } from '../persistency/persistency.service';
import { Message } from '../message/message';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { UserService } from '../user/user.service';
import { Response } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private API_URL = 'bff/messaging/conversation/';
  private selfId = this.userService.user.id;

  constructor(
    private http: HttpService,
    private realTime: RealTimeService,
    private messageService: MessageService,
    private persistencyService: PersistencyService,
    private eventService: EventService,
    private userService: UserService) {
    }
  
  public conversations: InboxConversation[];

  public subscribeChatEvents() {
    this.eventService.subscribe(EventService.INBOX_LOADED, (conversations: InboxConversation[]) => {
      this.conversations = conversations;
    });
    this.eventService.subscribe(EventService.NEW_MESSAGE, (message: Message) => {
      const inboxMessage = new InboxMessage(message.id, message.thread, message.message, message.from, message.fromSelf, message.date,
        message.status, message.payload, message.phoneRequest);
      this.processNewMessage(inboxMessage);
    });
    this.eventService.subscribe(EventService.CHAT_SIGNAL, (signal: ChatSignal) => {
      this.processNewChatSignal(signal);
    });
  }

  public openConversation(conversation: InboxConversation) {
    this.eventService.emit(EventService.CURRENT_CONVERSATION_SET, conversation);
    if (conversation.unreadCounter) {
      this.realTime.sendRead(conversation.user.id, conversation.id);
    }
  }

  public processNewMessage(message: InboxMessage) {
    const existingConversation = this.conversations.find(c => c.id === message.thread);
    if (existingConversation) {
      this.addNewMessage(existingConversation, message);
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
      this.persistencyService.saveInboxMessages(message);
      this.eventService.emit(EventService.MESSAGE_ADDED, message);
      if (!message.fromSelf) {
        this.incrementUnreadCounter(conversation);
      }
    }
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
        this.markAs(messageStatus.SENT, signal.messageId, signal.thread);
        break;
      case chatSignalType.RECEIVED:
        this.markAs(messageStatus.RECEIVED, signal.messageId, signal.thread);
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
      const unreadMessages = conversation.messages.filter(message => (message.status === messageStatus.RECEIVED ||
        message.status === messageStatus.SENT) && (markMessagesFromSelf ? message.fromSelf &&
        new Date(message.date).getTime() <= timestamp : !message.fromSelf));
      unreadMessages.map((message) => {
        message.status = messageStatus.READ;
        this.persistencyService.updateInboxMessageStatus(message, messageStatus.READ);
      });
      if (!markMessagesFromSelf) {
        conversation.unreadCounter -= unreadMessages.length;
        this.messageService.totalUnreadMessages -= unreadMessages.length;
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
      this.conversations.unshift(conversation);
      this.eventService.emit(EventService.INBOX_LOADED, this.conversations);
      this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
    },
    (err) => {
      // This is to display incoming messages if for some reason fetching the conversation fails.
      const conversation = InboxConversation.errorConversationFromMessage(message);
      this.conversations.unshift(conversation);
      this.eventService.emit(EventService.INBOX_LOADED, this.conversations);
      this.eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
    });
  }

  private getConversation(id: String): Observable<InboxConversation> {
    return this.http.get(this.API_URL + id)
    .map((res: Response) => {
      return this.buildConversation(res);
    });
  }

  private buildConversation(res: Response): InboxConversation {
    const json = res.json();
    return InboxConversation.fromJSON(json, this.selfId);
  }
}
