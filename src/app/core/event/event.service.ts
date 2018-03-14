import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class EventService {

  public static USER_LOGIN: string = 'loginEvent';
  public static USER_LOGOUT: string = 'logoutEvent';
  public static NEW_MESSAGE: string = 'newMessage';
  public static MESSAGE_ADDED: string = 'messageAdded';
  public static CONVERSATION_READ: string = 'conversationRead';
  public static CONNECTION_ERROR: string = 'connectionError';
  public static CONNECTION_RESTORED: string = 'connectionRestored';
  public static CONVERSATION_ARCHIVED: string = 'conversationArchived';
  public static CONVERSATION_UNARCHIVED: string = 'conversationUnarchived';
  public static LEAD_ARCHIVED: string = 'leadArchived';
  public static ITEM_SOLD: string = 'itemSold';
  public static USER_BLOCKED: string = 'userBlocked';
  public static USER_UNBLOCKED: string = 'userUnblocked';
  public static FIND_CONVERSATION = 'findConversation';
  public static UPDATE_COORDINATE = 'updateCoordinate';
  public static UPDATE_CATEGORY = 'updateCategory';
  public static UPDATE_SEARCH = 'updateSearch';

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
