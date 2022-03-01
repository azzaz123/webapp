import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunicationsConsentResponseDto } from '@api/communications-consent/dtos/response/communications-consent-response-dto';
import { HttpClient } from '@angular/common/http';
import { COMMUNICATIONS_CONSENT_SET_ENDPOINT, COMMUNICATIONS_CONSENT_ENDPOINT } from '@api/communications-consent/http/endpoints';

@Injectable({
  providedIn: 'root',
})
export class CommunicationsConsentHttpService {
  public constructor(private httpClient: HttpClient) {}

  public getMyNotificationsSettings(): Observable<CommunicationsConsentResponseDto> {
    return this.httpClient.get<CommunicationsConsentResponseDto>(COMMUNICATIONS_CONSENT_ENDPOINT);
  }

  public setNotificationEnable(notificationId): Observable<void> {
    return this.httpClient.post<void>(`${COMMUNICATIONS_CONSENT_SET_ENDPOINT}/${notificationId}/enable`, {});
  }

  public setNotificationDisabled(notificationId): Observable<void> {
    return this.httpClient.post<void>(`${COMMUNICATIONS_CONSENT_SET_ENDPOINT}/${notificationId}/disable`, {});
  }
}
