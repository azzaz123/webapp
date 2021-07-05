import { share } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  public static USER_LOGIN = 'loginEvent';
  public static USER_LOGOUT = 'logoutEvent';
  public static NEW_MESSAGE = 'newMessage';
  public static MESSAGE_ADDED = 'messageAdded';
  public static MORE_MESSAGES_LOADED = 'moreMessagesLoaded';
  public static CHAT_SIGNAL = 'chatSignal';
  public static CHAT_LAST_RECEIVED_TS = 'chatLastReceivedTs';
  public static MESSAGE_READ_ACK = 'messageReadAck';
  public static MESSAGE_SENT = 'messageSent';
  public static MESSAGE_RECEIVED_ACK = 'messageReceivedAck';
  public static CHAT_CAN_PROCESS_RT = 'chatCanProcessRt';
  public static INBOX_LOADED = 'inboxLoaded';
  public static ARCHIVED_INBOX_LOADED = 'archivedInboxLoaded';
  public static CONNECTION_ERROR = 'connectionError';
  public static CONNECTION_RESTORED = 'connectionRestored';
  public static CHAT_RT_CONNECTED = 'chatRealTimeConnected';
  public static CHAT_RT_DISCONNECTED = 'chatRealTimeDisconnected';
  public static CURRENT_CONVERSATION_SET = 'currentConversationSet';
  public static CONVERSATION_ARCHIVED = 'conversationArchived';
  public static CONVERSATION_UNARCHIVED = 'conversationUnarchived';
  public static LEAD_ARCHIVED = 'leadArchived';
  public static ITEM_SOLD = 'itemSold';
  public static ITEM_UPDATED = 'itemUpdated';
  public static ITEM_RESERVED = 'itemReserved';
  public static TOTAL_CREDITS_UPDATED = 'packBought';
  public static PRIVACY_LIST_UPDATED = 'privacyListUpdated';
  public static INBOX_READY = 'inboxReady';
  public static ARCHIVED_INBOX_READY = 'archivedInboxReady';
  public static FORM_SUBMITTED = 'formSubmitted';

  private subjects: any = {};

  public emit(eventName: string, ...args: any[]): void {
    this.createSubject(eventName);
    this.subjects[eventName].subject.next(args);
  }

  public subscribe(eventName: string, callback: Function): Subscription {
    this.createSubject(eventName);
    return this.subjects[eventName].observable.subscribe((args: any) => {
      callback(...args);
    });
  }

  public unsubscribeAll(eventName: string) {
    this.subjects[eventName] = null;
  }

  private createSubject(eventName: string) {
    if (!this.subjects[eventName]) {
      const subject = new Subject();
      this.subjects[eventName] = {
        observable: subject.asObservable().pipe(share()),
        subject: subject,
      };
    }
  }
}
