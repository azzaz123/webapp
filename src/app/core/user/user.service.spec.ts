import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import {
  EventService,
  HttpService,
  I18nService,
  LoginResponse,
  MOCK_USER_RESPONSE_BODY,
  TEST_HTTP_PROVIDERS
} from 'shield';
import { AccessTokenService } from './access-token.service';
import { HaversineService } from 'ng2-haversine';
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

describe('UserService', () => {

  let service: UserService;
  let http: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        EventService,
        I18nService,
        HaversineService,
        AccessTokenService,
        ...TEST_HTTP_PROVIDERS
      ]
    });
    service = TestBed.get(UserService);
    http = TestBed.get(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    let response: LoginResponse;
    const DATA: any = {
      emailAddress: 'test@test.it',
      installationType: 'ANDROID',
      password: 'test'
    };
    const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(MOCK_USER_RESPONSE_BODY)});
    beforeEach(() => {
      spyOn(http, 'postUrlEncoded').and.returnValue(Observable.of(new Response(res)));
      spyOn<any>(service, 'storeData').and.callThrough();
      service.login(DATA).subscribe((r: LoginResponse) => {
        response = r;
      });
    });
    it('should call endpoint and return response', () => {
      expect(http.postUrlEncoded).toHaveBeenCalledWith('shnm-portlet/api/v1/access.json/login3', DATA);
      expect(response).toEqual(MOCK_USER_RESPONSE_BODY);
    });
    it('should call StoreData', () => {
      expect(service['storeData']).toHaveBeenCalledWith(MOCK_USER_RESPONSE_BODY);
    });
  });
});
