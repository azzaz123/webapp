import { Injectable } from '@angular/core';
import { mapNotificationsFromBraze } from './mappers/notification-mapper';
import { Notification } from '@api/core/model/notification/notification.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppboyContentCards } from '@core/communication/vendors/appboy.interface';
import { ExternalCommsService } from '@core/external-comms.service';
import { UserService } from '@core/user/user.service';
import { NotificationDto } from '@api/notification/dtos/response/notifcation-dto';

@Injectable()
export class NotificationApiService {
  private _unreadNotificationsCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _notificationsCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _notifications$: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
  private handlers: Function[] = [];

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
      this.refreshNotifications();
    });
  }

  public refreshNotifications(handler?: Function): void {
    if (handler) {
      this.handlers.push(handler);
    }
    appboy.requestContentCardsRefresh();
  }

  public logContentCardsDisplayed(): void {
    appboy.logContentCardsDisplayed();
  }

  public logContentCard(id: string): void {
    const cachedContentCard = this.filterNotificationCenterContentCards(appboy.getCachedContentCards().cards).find(
      (card) => card.id === id
    );
    appboy.logCardImpressions([cachedContentCard], true);
  }

  public logCardClick(id: string): void {
    const card = appboy.getCachedContentCards().cards.find((card) => id === card.id);
    appboy.logCardClick(card, true);
    appboy.requestImmediateDataFlush();
  }

  private handleContentCardUpdates(appboyContentCards: AppboyContentCards): void {
    if (this.userService.isLogged) {
      const notifications = mapNotificationsFromBraze(this.filterNotificationCenterContentCards(appboyContentCards.cards));
      this._notifications$.next(notifications);
      this._notificationsCount$.next(notifications.length);
      this._unreadNotificationsCount$.next(notifications.filter((notification) => !notification.isRead).length);
      for (let handler of this.handlers) {
        handler();
      }
      this.handlers = [];
    }
  }

  private filterNotificationCenterContentCards(cards: NotificationDto[]): NotificationDto[] {
    return cards.filter((card) => card.extras.feed_type === 'notification_center' && card.url);
  }
}
