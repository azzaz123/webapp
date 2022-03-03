import { Injectable } from '@angular/core';
import { mapNotificationsFromBraze } from './mappers/notification-mapper';
import { Notification } from '@api/core/model/notification/notification.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppboyContentCards } from '@core/communication/vendors/appboy.interface';
import { ExternalCommsService } from '@core/external-comms.service';
import { UserService } from '@core/user/user.service';

@Injectable()
export class NotificationApiService {
  private _unreadNotificationsCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _notificationsCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _notifications$: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);

  get notificationsCount$(): Observable<number> {
    return this._notificationsCount$.asObservable();
  }

  get unreadNotificationsCount$(): Observable<number> {
    return this._unreadNotificationsCount$.asObservable();
  }

  get notifications$(): Observable<Notification[]> {
    return this._notifications$.asObservable();
  }

  get notificationsCount(): number {
    return this._notificationsCount$.value;
  }

  get unreadNotificationsCount(): number {
    return this._unreadNotificationsCount$.value;
  }

  get notifications(): Notification[] {
    return this._notifications$.value;
  }

  constructor(private externalCommsService: ExternalCommsService, private userService: UserService) {
    externalCommsService.brazeReady$.subscribe(() => {
      appboy.subscribeToContentCardsUpdates(this.handleContentCardUpdates.bind(this));
      if (this.userService.isLogged) {
        this.refreshNotifications();
      }
    });
  }

  public refreshNotifications(): void {
    appboy.requestContentCardsRefresh();
  }

  public logContentCardsDisplayed(): void {
    appboy.logContentCardsDisplayed();
    // FIXME: Should only send the ones that are actually inside the viewport
    appboy.logCardImpressions(appboy.getCachedContentCards().cards);
  }

  public logCardClick(): void {
    appboy.logCardClick();
  }

  private handleContentCardUpdates(appboyContentCards: AppboyContentCards): void {
    console.log(appboyContentCards);
    this._notifications$.next(mapNotificationsFromBraze(appboyContentCards.cards));
    this._notificationsCount$.next(appboyContentCards.cards.length);
    this._unreadNotificationsCount$.next(appboyContentCards.getUnviewedCardCount());
  }
}
