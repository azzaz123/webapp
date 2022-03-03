import { Injectable } from '@angular/core';
import { mapNotificationsFromBraze } from './mappers/notification-mapper';
import { Notification } from '@api/core/model/notification/notification.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Injectable()
export class NotificationApiService {
  private _totalUnreadNotifications$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  get totalUnreadNotifications$(): Observable<number> {
    return this._totalUnreadNotifications$.asObservable();
  }

  set totalUnreadNotifications(value: number) {
    value = Math.max(value, 0);
    this._totalUnreadNotifications$.next(value);
  }

  public getNotifications(): Notification[] {
    const brazeNotifications = appboy.getCachedContentCards();
    return mapNotificationsFromBraze(brazeNotifications.cards);
  }

  public refreshUnreadNotifications(): void {
    const unreadNotifications = this.getNotifications().filter((notification) => !notification.isRead).length;
    this._totalUnreadNotifications$.next(unreadNotifications);
  }
}
