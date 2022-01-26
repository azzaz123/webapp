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
  public notificationsForm: FormArray;
  public allowSegmentation: boolean;

  constructor(private meApiService: MeApiService, private fb: FormBuilder) {
    this.notificationsForm = fb.array([]);
  }

  ngOnInit(): void {
    this.meApiService
      .getMyNotificationsSettings()
      .subscribe((data) =>
        data.notificationGroups.map((notificationGroup) => this.notificationsForm.push(this.addNewNotificationFormGroup(notificationGroup)))
      );
    console.log(this.notificationsForm);
  }

  addNewNotificationFormGroup(notificationGroup: NotificationsSettingsDto): FormGroup {
    return this.fb.group({
      notifications: new FormArray(
        notificationGroup.notifications.map((notificationDetail) => this.addNewNotificationDetailForm(notificationDetail))
      ),
      subtitle: new FormControl(notificationGroup.subtitle),
      title: new FormControl(notificationGroup.title),
    });
  }

  addNewNotificationDetailForm(notificationDetail: NotificationsDto): FormGroup {
    const { enabled, id, title } = notificationDetail;
    return this.fb.group({
      enabled: new FormControl(enabled),
      id: new FormControl(id),
      title: new FormControl(title),
    });
  }
}
