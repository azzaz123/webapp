import { Component, OnInit } from '@angular/core';
import { MeApiService } from '@api/me/me-api.service';
import { NotificationSettings } from '@api/core/model/notifications';

@Component({
  selector: 'tsl-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  public notificationsSettingsGroup: NotificationSettings[];
  public allowSegmentation: boolean;
  private savedSearchedNotificationId = 'l1kmzng6n3p8';

  constructor(private meApiService: MeApiService) {}

  ngOnInit(): void {
    this.getMyNotificationsSettings();
  }

  public getMyNotificationsSettings() {
    this.meApiService.getMyNotificationsSettings().subscribe((data) => {
      const filteredNotifications = data
        .map((nGroup) => {
          const noSavedSearchesId = nGroup.notifications.find((notification) => notification.id !== this.savedSearchedNotificationId);
          if (noSavedSearchesId) {
            return nGroup;
          }
        })
        .filter((ngroup) => !!ngroup);
      this.notificationsSettingsGroup = filteredNotifications;
    });
  }

  public handleChange(notification) {
    const { id, enabled } = notification;

    if (enabled) {
      this.meApiService.setNotificationEnable(id).subscribe();
    } else {
      this.meApiService.setNotificationDisabled(id).subscribe();
    }
  }
}
