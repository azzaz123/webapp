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

  constructor(private meApiService: MeApiService) {}

  ngOnInit(): void {
    this.meApiService.getMyNotificationsSettings().subscribe((data) => {
      this.notificationsSettingsGroup = data.notificationGroups;
      console.log(this.notificationsSettingsGroup);
    });
  }

  handleChange($event) {
    console.log($event);
  }
}
