import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationSettings } from '@api/core/model/notifications';
import { map } from 'rxjs/operators';
import { NotificationsSettingsResponseDto } from '@api/me/dtos/notifications-settings/response/notifcations-settings-response-dto';
import { mapNotificationsSettings } from '@api/me/mappers/notifications-copies-mapper';
import { I18nService } from '@core/i18n/i18n.service';
import { NotificationsHttpService } from '@api/notifications/http/notifications-http.service';

@Injectable()
export class NotificationsApiService {
  public constructor(private httpService: NotificationsHttpService, private i18nService: I18nService) {}

  public getMyNotificationsSettings(): Observable<NotificationSettings[]> {
    return this.httpService.getMyNotificationsSettings().pipe(
      map(({ notificationGroups }: NotificationsSettingsResponseDto) => {
        return mapNotificationsSettings(notificationGroups, this.i18nService);
      })
    );
  }

  public setNotificationEnable(notificationId): Observable<void> {
    return this.httpService.setNotificationEnable(notificationId);
  }

  public setNotificationDisabled(notificationId): Observable<void> {
    return this.httpService.setNotificationDisabled(notificationId);
  }
}
