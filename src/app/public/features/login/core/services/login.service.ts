import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeviceService } from '@core/device/device.service';
import { EventService } from '@core/event/event.service';
import { AccessTokenService } from '@core/http/access-token.service';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AccessMetadata } from '../interfaces/access-metadata';
import { LoginRequest } from '../interfaces/login.request';
import { LoginResponse } from '../interfaces/login.response';

export const LOGIN_ENDPOINT = 'api/v3/users/access/login';

@Injectable()
export class LoginService {
  constructor(
    private httpClient: HttpClient,
    private eventService: EventService,
    private accessTokenService: AccessTokenService,
    private deviceService: DeviceService
  ) {}

  public login(body: LoginRequest): Observable<LoginResponse> {
    body.metadata = this.getMetadata();
    return this.httpClient.post<LoginResponse>(`${environment.baseUrl}${LOGIN_ENDPOINT}`, body).pipe(tap((r) => this.storeData(r)));
  }

  private getMetadata(): AccessMetadata {
    return {
      installationId: this.deviceService.getDeviceId(),
      installationType: 'WEB',
      pushToken: '',
    };
  }

  private storeData(data: LoginResponse): void {
    const { token } = data;
    this.accessTokenService.storeAccessToken(token);
    this.eventService.emit(EventService.USER_LOGIN, token);
  }
}
