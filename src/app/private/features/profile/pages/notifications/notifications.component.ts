import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Tier } from '@core/subscriptions/subscriptions.interface';
import { MeApiService } from '@api/me/me-api.service';
import { NotificationsSettingsDto } from '@api/me/dtos/notifications-settings/response/notifcations-settings-dto';
import { NotificationsDto } from '@api/me/dtos/notifications/response/notifcations-dto';

@Component({
  selector: 'tsl-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  public notificationsSettingsGroup: NotificationsSettingsDto[];
  public allowSegmentation: boolean;
  private savedSearchedNotificationId = 'l1kmzng6n3p8';

  constructor(private meApiService: MeApiService) {}

  ngOnInit(): void {
    this.meApiService.getMyNotificationsSettings().subscribe((data) => {
      const filteredNotifications = data.notificationGroups
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

  handleChange(notification) {
    const { id, enabled } = notification;

    if (enabled) {
      this.meApiService.setNotificationEnable(id).subscribe();
    } else {
      this.meApiService.setNotificationDisabled(id).subscribe();
    }
  }
}
