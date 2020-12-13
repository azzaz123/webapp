import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventService } from '@core/event/event.service';
import { AccessTokenService } from '@core/http/access-token.service';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginResponse } from '../login-response.interface';

export const LOGIN_ENDPOINT = 'shnm-portlet/api/v1/access.json/login3';

@Injectable()
export class LoginService {
  constructor(
    private httpClient: HttpClient,
    private eventService: EventService,
    private accessTokenService: AccessTokenService
  ) {}

  public login(data: any): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new HttpParams()
      .set('emailAddress', data.emailAddress)
      .set('installationType', data.installationType)
      .set('password', data.password);

    return this.httpClient
      .post<LoginResponse>(`${environment.baseUrl}${LOGIN_ENDPOINT}`, body, {
        headers,
      })
      .pipe(map((r) => this.storeData(r)));
  }

  private storeData(data: LoginResponse): LoginResponse {
    const { token } = data;
    this.accessTokenService.storeAccessToken(token);
    this.eventService.emit(EventService.USER_LOGIN, token);
    return data;
  }
}
