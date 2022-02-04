import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsSettingsResponseDto } from '@api/notifications/dtos/response/notifcations-settings-response-dto';
import { BASE_SET_NOTIFICATION, NOTIFICATIONS_API_URL_ENDPOINT } from '@api/me/http/endpoints';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NotificationsHttpService {
  public constructor(private httpClient: HttpClient) {}

  public getMyNotificationsSettings(): Observable<NotificationsSettingsResponseDto> {
    return this.httpClient.get<NotificationsSettingsResponseDto>(NOTIFICATIONS_API_URL_ENDPOINT);
  }

  public setNotificationEnable(notificationId): Observable<void> {
    return this.httpClient.post<void>(`${BASE_SET_NOTIFICATION}/${notificationId}/enable`, {});
  }

  public setNotificationDisabled(notificationId): Observable<void> {
    return this.httpClient.post<void>(`${BASE_SET_NOTIFICATION}/${notificationId}/disable`, {});
  }
}
