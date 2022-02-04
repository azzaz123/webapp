import { Component, OnInit } from '@angular/core';
import { NotificationConsent, NotificationSettings } from '@api/core/model/notifications';
import { NotificationsApiService } from '@api/notifications/notifications-api.service';
import { Observable, ReplaySubject } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'tsl-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  public allowSegmentation: boolean;
  public notificationsSettings$: Observable<NotificationSettings[]> = this.getMyNotificationsSettings();
  private savedSearchedNotificationId = 'l1kmzng6n3p8';

  constructor(private notificationsApiService: NotificationsApiService) {}

  ngOnInit(): void {
    this.getMyNotificationsSettings();
  }

  public getMyNotificationsSettings() {
    return this.notificationsApiService.getMyNotificationsSettings().pipe(
      map((nGroup) => {
        const noSavedSearchesId = nGroup.map((group) =>
          group.notifications.find((notification) => notification.id !== this.savedSearchedNotificationId)
        );
        if (noSavedSearchesId) {
          return nGroup;
        }
      }),
      filter((ngroup) => !!ngroup)
    );
  }

  public handleChange(notification: NotificationConsent) {
    const { id, enabled } = notification;

    if (enabled) {
      this.notificationsApiService.setNotificationEnable(id).subscribe();
    } else {
      this.notificationsApiService.setNotificationDisabled(id).subscribe();
    }
  }
}
