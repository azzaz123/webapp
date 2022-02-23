import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunicationsConsentGroup } from '@api/core/model/communications-consent';
import { map } from 'rxjs/operators';
import { CommunicationsConsentResponseDto } from '@api/communications-consent/dtos/response/communications-consent-response-dto';
import { mapCommunicationsConsentGroup } from '@api/communications-consent/mappers/communications-consent-mapper';
import { I18nService } from '@core/i18n/i18n.service';
import { CommunicationsConsentHttpService } from '@api/communications-consent/http/communications-consent-http.service';

@Injectable()
export class CommunicationsConsentApiService {
  public constructor(private httpService: CommunicationsConsentHttpService, private i18nService: I18nService) {}

  public getMyNotificationsSettings(): Observable<CommunicationsConsentGroup[]> {
    return this.httpService.getMyNotificationsSettings().pipe(
      map(({ notificationGroups }: CommunicationsConsentResponseDto) => {
        return mapCommunicationsConsentGroup(notificationGroups, this.i18nService);
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
