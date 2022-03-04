import { Injectable } from '@angular/core';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { combineLatest, Observable, BehaviorSubject, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BOTTOM_NAVIGATION_BAR_ELEMENTS, BOTTOM_NAVIGATION_BAR_ELEMENTS_COLLECTION } from '../constants/bottom-navigation-bar-elements';
import { BottomNavigationBarElement } from '../interfaces/bottom-navigation-bar-element.interface';

@Injectable()
export class BottomNavigationBarService {
  private readonly hiddenSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private unreadChatMessagesService: UnreadChatMessagesService) {}

  get navigationElements$(): Observable<BottomNavigationBarElement[]> {
    return combineLatest([
      of(BOTTOM_NAVIGATION_BAR_ELEMENTS_COLLECTION),
      this.unreadChatMessagesService.totalUnreadMessages$.pipe(startWith(0)),
    ]).pipe(
      map(([elements, totalUnreadMessages]) => {
        elements[BOTTOM_NAVIGATION_BAR_ELEMENTS.INBOX].pendingNotification = !!totalUnreadMessages;

        return Object.values(elements);
      })
    );
  }

  get hidden$() {
    return this.hiddenSubject.asObservable();
  }

  private set hidden(value: boolean) {
    this.hiddenSubject.next(value);
  }

  public hideNavigationBar() {
    this.hidden = true;
  }

  public showNavigationBar() {
    this.hidden = false;
  }
}
