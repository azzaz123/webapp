import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import {
  AccessTokenService,
  EventService,
  HttpService,
  I18nService,
  Item,
  ITEM_LOCATION,
  LoginResponse,
  MOCK_ITEM,
  MOCK_USER,
  MOCK_USER_RESPONSE_BODY,
  TEST_HTTP_PROVIDERS,
  User,
  USER_ID,
  USER_LOCATION
} from 'shield';
import { HaversineService } from 'ng2-haversine';
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

describe('UserService', () => {

  let service: UserService;
  let http: HttpService;
  let haversineService: HaversineService;
  let accessTokenService: AccessTokenService;
  let event: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        EventService,
        I18nService,
        HaversineService,
        AccessTokenService,
        ...TEST_HTTP_PROVIDERS,
        {
          provide: 'SUBDOMAIN', useValue: 'www'
        }
      ]
    });
    service = TestBed.get(UserService);
    http = TestBed.get(HttpService);
    haversineService = TestBed.get(HaversineService);
    accessTokenService = TestBed.get(AccessTokenService);
    event = TestBed.get(EventService);
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

  describe('logout', () => {
    const res: ResponseOptions = new ResponseOptions({body: 'redirect_url'});
    let redirectUrl: string;
    beforeEach(() => {
      spyOn(http, 'postNoBase').and.returnValue(Observable.of(new Response(res)));
      spyOn(accessTokenService, 'deleteAccessToken').and.callThrough();
      event.subscribe(EventService.USER_LOGOUT, (param) => {
        redirectUrl = param;
      });
      service.logout();
    });
    it('should call endpoint', () => {
      expect(http.postNoBase).toHaveBeenCalledWith('http://www.dev.wallapop.com:8080/rest/logout');
    });
    it('should call deleteAccessToken', () => {
      expect(accessTokenService.deleteAccessToken).toHaveBeenCalled();
    });
    it('should call event passing redirect url', () => {
      expect(redirectUrl).toBe('redirect_url');
    });
  });

  describe('calculateDistanceFromItem', () => {

    beforeEach(() => {
      spyOn(haversineService, 'getDistanceInKilometers').and.returnValue(1);
    });

    it('should call the haversineService and return a number', () => {
      const user: User = MOCK_USER;
      const item: Item = MOCK_ITEM;
      const user2: User = new User(
        USER_ID,
        null,
        null,
        ITEM_LOCATION
      );
      service['_user'] = user2;
      const distance: number = service.calculateDistanceFromItem(user, item);
      expect(haversineService.getDistanceInKilometers).toHaveBeenCalledWith({
        latitude: ITEM_LOCATION.approximated_latitude,
        longitude: ITEM_LOCATION.approximated_longitude
      }, {
        latitude: USER_LOCATION.approximated_latitude,
        longitude: USER_LOCATION.approximated_longitude,
      });
      expect(distance).toBe(1);
    });

    it('should not call the haversineService and return null', () => {
      const user: User = new User(USER_ID);
      const item: Item = MOCK_ITEM;
      service['_user'] = new User(USER_ID);
      const distance: number = service.calculateDistanceFromItem(user, item);
      expect(haversineService.getDistanceInKilometers).not.toHaveBeenCalled();
      expect(distance).toBeNull();
    });

  });

});
