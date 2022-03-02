import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeviceService } from '@core/device/device.service';
import { EventService } from '@core/event/event.service';
import { AccessTokenService } from '@core/http/access-token.service';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { AccessMetadata } from '../interfaces/access-metadata';
import { LoginRequest } from '../interfaces/login.request';
import { LoginResponse } from '../interfaces/login.response';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { UserService } from '@core/user/user.service';
import { User } from '@core/user/user';

export const LOGIN_ENDPOINT = 'api/v3/access/login';

@Injectable()
export class LoginService {
  constructor(
    private httpClient: HttpClient,
    private eventService: EventService,
    private accessTokenService: AccessTokenService,
    private deviceService: DeviceService,
    private analyticsService: AnalyticsService,
    private userService: UserService
  ) {}

  public login(body: LoginRequest, callback?: () => void): Observable<User> {
    body.metadata = this.getMetadata();
    const headers = this.getHeaders();

    return this.httpClient.post<LoginResponse>(`${environment.baseUrl}${LOGIN_ENDPOINT}`, body, { headers }).pipe(
      tap((r) => this.storeData(r)),
      concatMap(() => this.userService.getLoggedUserInformation()),
      tap((r) => this.analyticsService.loginUser({ customerid: r.id, email: r.email }, callback))
    );
  }

  private getMetadata(): AccessMetadata {
    return {
      recaptchaToken: '',
      sessionId: this.deviceService.getDeviceId(),
    };
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-DeviceToken': this.deviceService.getDeviceId(),
      'X-DeviceID': this.deviceService.getDeviceId(),
      'X-AppVersion': '0',
    });
  }

  private storeData(data: LoginResponse): void {
    const { token } = data;
    this.accessTokenService.storeAccessToken(token);
    this.eventService.emit(EventService.USER_LOGIN, token);
  }
}
