import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class EventService {

  public static USER_LOGIN = 'loginEvent';
  public static USER_LOGOUT = 'logoutEvent';
  public static NEW_MESSAGE = 'newMessage';
  public static MESSAGE_ADDED = 'messageAdded';
  public static CHAT_SIGNAL = 'chatSignal';
  public static CHAT_LAST_RECEIVED_TS = 'chatLastReceivedTs';
  public static MESSAGE_READ_ACK = 'messageReadAck';
  public static MESSAGE_SENT = 'messageSent';
  public static MESSAGE_RECEIVED_ACK = 'messageReceivedAck';
  public static CHAT_CAN_PROCESS_RT = 'chatCanProcessRt';
  public static INBOX_LOADED = 'inboxLoaded';
  public static CONNECTION_ERROR = 'connectionError';
  public static CONNECTION_RESTORED = 'connectionRestored';
  public static CHAT_RT_CONNECTED = 'chatRealTimeConnected';
  public static CHAT_RT_DISCONNECTED = 'chatRealTimeDisconnected';
  public static CURRENT_CONVERSATION_SET = 'currentConversationSet';
  public static CONVERSATION_ARCHIVED = 'conversationArchived';
  public static CONVERSATION_UNARCHIVED = 'conversationUnarchived';
  public static CONV_WITH_PHONE_CREATED = 'conversationWithPhoneCreated';
  public static LEAD_ARCHIVED = 'leadArchived';
  public static ITEM_SOLD = 'itemSold';
  public static ITEM_UPDATED = 'itemUpdated';
  public static ITEM_RESERVED = 'itemReserved';
  public static FIND_CONVERSATION = 'findConversation';
  public static UPDATE_COORDINATE = 'updateCoordinate';
  public static UPDATE_CATEGORY = 'updateCategory';
  public static UPDATE_SEARCH = 'updateSearch';
  public static CLOSE_EXPANDED_CALLS = 'closeExpandedCalls';
  public static TOTAL_CREDITS_UPDATED = 'packBought';
  public static DB_READY = 'dbReady';
  public static INBOX_DB_READY = 'inboxDbReady';
  public static FOUND_MESSAGES_IN_DB = 'foundMessagesInDb';
  public static CONVERSATION_BUMPED = 'conversationBumped';
  public static HTTP_REQUEST_FAILED = 'httpRequestFailed';
  public static REQUEST_PHONE = 'requestPhone';
  public static PRIVACY_LIST_UPDATED = 'privacyListUpdated';

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
        observable: subject.asObservable().share(),
        subject: subject
      };
    }
  }
}
