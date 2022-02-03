import { Component, OnInit } from '@angular/core';
import { NotificationConsent, NotificationSettings } from '@api/core/model/notifications';
import { NotificationsApiService } from '@api/notifications/notifications-api.service';

@Component({
  selector: 'tsl-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  public notificationsSettingsGroup: NotificationSettings[];
  public allowSegmentation: boolean;
  private savedSearchedNotificationId = 'l1kmzng6n3p8';

  constructor(private notificationsApiService: NotificationsApiService) {}

  ngOnInit(): void {
    this.getMyNotificationsSettings();
  }

  public getMyNotificationsSettings() {
    this.notificationsApiService.getMyNotificationsSettings().subscribe((data) => {
      this.notificationsSettingsGroup = data
        .map((nGroup) => {
          const noSavedSearchesId = nGroup.notifications.find((notification) => notification.id !== this.savedSearchedNotificationId);
          if (noSavedSearchesId) {
            return nGroup;
          }
        })
        .filter((ngroup) => !!ngroup);
    });
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
