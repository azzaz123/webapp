import { Injectable } from '@angular/core';
import { UserService as UserServiceMaster, HttpService, EventService, I18nService, LoginResponse } from 'shield';
import { HaversineService } from 'ng2-haversine';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

@Injectable()
export class UserService extends UserServiceMaster {

  constructor(http: HttpService,
              event: EventService,
              i18n: I18nService,
              haversineService: HaversineService) {
    super(http, event, i18n, haversineService);
  }

  public login(data: any): Observable<LoginResponse> {
    return this.http.postUrlEncoded(
      'shnm-portlet/api/v1/access.json/login3',
      data,
    )
    .map((r: Response) => r.json())
    .map((r: LoginResponse) => this.storeData(r));
  }

}
