/* tslint:disable:no-unused-variable */

import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Response, ResponseOptions } from '@angular/http';
import { UserService } from './user.service';
import { HttpService } from '../http/http.service';
import { HaversineService } from 'ng2-haversine';
import { ITEM_LOCATION, MOCK_ITEM } from '../../../tests/item.fixtures.spec';
import { Item } from '../item/item';
import { Observable } from 'rxjs';
import { I18nService } from '../i18n/i18n.service';
import {
  CUSTOM_REASON,
  IMAGE,
  MICRO_NAME,
  MOCK_FULL_USER,
  MOCK_USER,
  MOCK_USER_RESPONSE_BODY,
  MOTORPLAN_DATA,
  ONLINE,
  PROFILE_SUB_INFO,
  REASONS,
  RESPONSE_RATE,
  SCORING_STARS,
  SCORING_STARTS,
  SELECTED_REASON,
  STATS,
  USER_DATA,
  USER_EDIT_DATA,
  USER_EMAIL,
  USER_ID,
  USER_INFO_RESPONSE,
  USER_LOCATION,
  USER_LOCATION_COORDINATES,
  USER_PRO_DATA,
  USER_PRO_INFO_NOTIFICATIONS,
  USER_PRO_INFO_RESPONSE,
  USERS_STATS,
  USERS_STATS_RESPONSE,
  VALIDATIONS,
  VERIFICATION_LEVEL
} from '../../../tests/user.fixtures.spec';
import { AvailableSlots, UserStatsResponse } from './user-stats.interface';
import { UnsubscribeReason } from './unsubscribe-reason.interface';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { AccessTokenService } from '../http/access-token.service';
import { EventService } from '../event/event.service';
import { PERMISSIONS, User } from './user';
import { environment } from '../../../environments/environment';
import { LoginResponse } from './login-response.interface';
import { Image, MotorPlan, UserLocation } from './user-response.interface';
import { CookieService } from 'ngx-cookie';
import { NgxPermissionsService } from 'ngx-permissions';
import { FEATURE_FLAGS_ENUM, FeatureflagService } from './featureflag.service';
import { SplitTestService } from '../tracking/split-test.service';
import { HttpModuleNew } from '../http/http.module.new';
import { APP_VERSION } from '../../../environments/version';

describe('Service: User', () => {

  let service: UserService;
  let mockBackend: MockBackend;
  let http: HttpService;
  let haversineService: HaversineService;
  const FAKE_USER_NAME = 'No disponible';
  let accessTokenService: AccessTokenService;
  let event: EventService;
  let cookieService: CookieService;
  let permissionService: NgxPermissionsService;
  let featureflagService: FeatureflagService;
  let splitTestService: SplitTestService;
  let httpTestingController: HttpTestingController;

  const mockMotorPlan = {
    type: 'motor_plan_pro',
    subtype: 'sub_premium'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HttpModuleNew
      ],
      providers: [
        ...TEST_HTTP_PROVIDERS,
        EventService,
        UserService,
        I18nService,
        HaversineService,
        {
          provide: 'SUBDOMAIN', useValue: 'www'
        },
        {
          provide: CookieService,
          useValue: {
            cookies: {},
            put(key, value) {
              this.cookies[key] = value;
            },
            remove(key) {
              delete this.cookies[key];
            }
          }
        },
        {
          provide: NgxPermissionsService,
          useValue: {
            addPermission() {
            },
            flushPermissions() {
            },
            hasPermission() {
            }
          }
        },
        {
          provide: FeatureflagService, useValue: {
            getFlag() {
              return Observable.of(true);
            }
          }
        },
        {
          provide: SplitTestService, useValue: {
            reset() {
            }
          }
        }
      ]
    });
    service = TestBed.get(UserService);
    mockBackend = TestBed.get(MockBackend);
    http = TestBed.get(HttpService);
    haversineService = TestBed.get(HaversineService);
    accessTokenService = TestBed.get(AccessTokenService);
    accessTokenService.storeAccessToken(null);
    event = TestBed.get(EventService);
    cookieService = TestBed.get(CookieService);
    permissionService = TestBed.get(NgxPermissionsService);
    featureflagService = TestBed.get(FeatureflagService);
    splitTestService = TestBed.get(SplitTestService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should return the user', () => {
    const user: User = new User('123');
    service['_user'] = user;
    expect(service.user).toBe(user);
  });

  describe('isLogged', () => {

    it('should not be logged', () => {
      expect(service.isLogged).toBeFalsy();
    });

    it('should be logged', () => {
      accessTokenService.storeAccessToken('abc');
      expect(service.isLogged).toBeTruthy();
    });
  });

  describe('get', () => {
    describe('without backend error', () => {
      beforeEach(fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toBe(environment.baseUrl + 'api/v3/users/' + USER_ID);
          const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(USER_DATA) });
          connection.mockRespond(new Response(res));
        });
      }));

      it('should return the User object', fakeAsync(() => {
        let user: User;
        service.get(USER_ID).subscribe((r: User) => {
          user = r;
        });
        expect(user instanceof User).toBeTruthy();
        expect(user.id).toBe(USER_ID);
        expect(user.microName).toBe(MICRO_NAME);
        // expect(user.image).toEqual(IMAGE);
        expect(user.location).toEqual(USER_LOCATION);
        expect(user.stats).toEqual(STATS);
        expect(user.validations).toEqual(VALIDATIONS);
        expect(user.verificationLevel).toBe(VERIFICATION_LEVEL);
        expect(user.scoringStars).toBe(SCORING_STARS);
        expect(user.scoringStarts).toBe(SCORING_STARTS);
        expect(user.responseRate).toBe(RESPONSE_RATE);
        expect(user.online).toBe(ONLINE);
      }));
    });
    describe('with backend error', () => {
      beforeEach(fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockError();
        });
      }));
      it('should return a fake User object', () => {
        let user: User;
        service.get(USER_ID).subscribe((r: User) => {
          user = r;
        });
        expect(user.id).toBe(USER_ID);
        expect(user.microName).toBe(FAKE_USER_NAME);
      });
    });
  });

  describe('me', () => {

    it('should retrieve and return the User object', fakeAsync(() => {
      spyOn(http, 'get').and.callThrough();
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toBe(environment.baseUrl + 'api/v3/users/me');
        const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(USER_DATA) });
        connection.mockRespond(new Response(res));
      });
      let user: User;
      service.me().subscribe((r: User) => {
        user = r;
      });
      expect(user instanceof User).toBeTruthy();
      expect(user.id).toBe(USER_ID);
      expect(user.microName).toBe(MICRO_NAME);
      expect(user.image).toBeDefined();
      expect(user.location).toEqual(USER_LOCATION);
      expect(user.stats).toEqual(STATS);
      expect(user.validations).toEqual(VALIDATIONS);
      expect(user.verificationLevel).toBe(VERIFICATION_LEVEL);
      expect(user.scoringStars).toBe(SCORING_STARS);
      expect(user.scoringStarts).toBe(SCORING_STARTS);
      expect(user.responseRate).toBe(RESPONSE_RATE);
      expect(user.online).toBe(ONLINE);
      expect(http.get).toHaveBeenCalled();
    }));

    it('should just return the User object if present', fakeAsync(() => {
      let user: User;
      spyOn(http, 'get');
      service['_user'] = new User('123');
      service.me().subscribe((r: User) => {
        user = r;
      });
      expect(user instanceof User).toBeTruthy();
      expect(user.id).toBe('123');
      expect(http.get).not.toHaveBeenCalled();
    }));

    it('should call http only once', () => {
      spyOn(http, 'get').and.callThrough();
      service.me().subscribe();
      service.me().subscribe();
      expect(http.get).toHaveBeenCalledTimes(1);
    });

  });

  describe('checkUserStatus', () => {

    it('should emit the LOGIN event if the user is logged', fakeAsync(() => {
      accessTokenService.storeAccessToken('abc');
      spyOn(service['event'], 'emit');
      service.checkUserStatus();
      expect(service['event'].emit).toHaveBeenCalledWith(EventService.USER_LOGIN, 'abc');
    }));

    it('should not emit the LOGIN event if the user is not logged', fakeAsync(() => {
      spyOn(service['event'], 'emit');
      service.checkUserStatus();
      expect(service['event'].emit).not.toHaveBeenCalled();
    }));
  });

  describe('sendUserPresence', () => {
    const intervalValue = 1000;
    const callTimes = 6;

    beforeEach(() => {
      spyOn(http, 'postNoBase').and.returnValue(Observable.of({}));
      spyOn(permissionService, 'flushPermissions').and.returnValue({});
      spyOn(accessTokenService, 'deleteAccessToken').and.callThrough();
      spyOn(http, 'post').and.returnValue(Observable.of({}));
      accessTokenService.storeAccessToken('abc');
    });

    it('should call the me/online endpoint ONCE when the client connects and then every <intervalValue> milliseconds', fakeAsync(() => {
      service.sendUserPresenceInterval(intervalValue);
      tick(intervalValue * callTimes);

      expect(http.post).toHaveBeenCalledWith('api/v3/users/me/online');
      expect(http.post).toHaveBeenCalledTimes(callTimes + 1);
      discardPeriodicTasks();
    }));

    it('should call the me/online endpoint ONCE when the client connects and stop after the user has logged out', fakeAsync(() => {
      service.sendUserPresenceInterval(intervalValue);
      tick(intervalValue * callTimes);
      service.logout();
      tick(intervalValue * 4);

      expect(http.post).toHaveBeenCalledWith('api/v3/users/me/online');
      expect(http.post).toHaveBeenCalledTimes(callTimes + 1);
      discardPeriodicTasks();
    }));
  });

  describe('getFakeUser', () => {
    it('should return a fake User object', () => {
      const user: User = (service as any).getFakeUser(USER_ID);
      expect(user.id).toBe(USER_ID);
      expect(user.microName).toBe(FAKE_USER_NAME);
    });

  });

  describe('login', () => {
    let response: LoginResponse;
    const DATA: any = {
      emailAddress: 'test@test.it',
      installationType: 'ANDROID',
      password: 'test'
    };
    const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(MOCK_USER_RESPONSE_BODY) });
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
    const res: ResponseOptions = new ResponseOptions({ body: 'redirect_url' });
    let redirectUrl: string;

    beforeEach(() => {
      spyOn(http, 'postNoBase').and.returnValue(Observable.of(new Response(res)));
      spyOn(permissionService, 'flushPermissions').and.returnValue({});
      spyOn(accessTokenService, 'deleteAccessToken').and.callThrough();
      spyOn(splitTestService, 'reset');

      event.subscribe(EventService.USER_LOGOUT, (param) => {
        redirectUrl = param;
      });
      cookieService.put('publisherId', 'someId');

      service.logout();
    });

    it('should call endpoint', () => {
      expect(http.postNoBase).toHaveBeenCalledWith(environment.siteUrl.replace('es', 'www') + 'rest/logout', undefined, undefined, true);
    });

    it('should call deleteAccessToken', () => {
      expect(accessTokenService.deleteAccessToken).toHaveBeenCalled();
    });

    it('should call event passing redirect url', () => {
      expect(redirectUrl).toBe('redirect_url');
    });

    it('should remove publisherId from cookie', () => {
      expect(cookieService['publisherId']).not.toBeDefined();
    });

    it('should call flush permissions', () => {
      expect(permissionService.flushPermissions).toHaveBeenCalled();
    });

    it('should reset the split test service session', () => {
      expect(splitTestService.reset).toHaveBeenCalled();
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

  describe('getInfo', () => {
    it('should call endpoint GET info and return response', () => {
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getInfo(USER_ID).subscribe(response => expect(response).toEqual(USER_INFO_RESPONSE));

      const req = httpTestingController.expectOne(`${environment.baseUrl}api/v3/users/${USER_ID}/extra-info`);

      expect(req.request.method).toEqual('GET');
      req.flush(USER_INFO_RESPONSE);
    });
  });

  describe('getProInfo', () => {
    it('should call endpoint GET phone info and return response', () => {
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getProInfo().subscribe(response => expect(response).toEqual(USER_PRO_INFO_RESPONSE));

      const req = httpTestingController.expectOne(`${environment.baseUrl}api/v3/protool/extraInfo`);

      expect(req.request.method).toEqual('GET');
      req.flush(USER_PRO_INFO_RESPONSE);
    });
  });

  describe('getUserCover', () => {
    it('should call endpoint GET user cover and return response', () => {
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getUserCover().subscribe(response => expect(response).toEqual(IMAGE));

      const req = httpTestingController.expectOne(`${environment.baseUrl}api/v3/users/me/cover-image`);
      expect(req.request.method).toEqual('GET');
      req.flush(IMAGE);
    });

    it('should return empty object if endpoint return error', () => {
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getUserCover().subscribe(response => expect(response).toEqual({} as Image));

      const req = httpTestingController.expectOne(`${environment.baseUrl}api/v3/users/me/cover-image`);
      expect(req.request.method).toEqual('GET');
      req.error(new ErrorEvent('network error'));
    });
  });

  describe('updateProInfo', () => {
    it('should call endpoint', () => {
      spyOn(http, 'post').and.callThrough();

      service.updateProInfo(USER_PRO_DATA).subscribe();

      expect(http.post).toHaveBeenCalledWith('api/v3/protool/extraInfo', USER_PRO_DATA);
    });
  });

  describe('updateProInfoNotifications', () => {
    it('should call endpoint', () => {
      spyOn(http, 'post').and.callThrough();

      service.updateProInfoNotifications(USER_PRO_INFO_NOTIFICATIONS).subscribe();

      expect(http.post).toHaveBeenCalledWith('api/v3/protool/extraInfo/notifications', USER_PRO_INFO_NOTIFICATIONS);
    });
  });

  describe('updateLocation', () => {
    it('should call endpoint and return response', () => {
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(USER_LOCATION) });
      spyOn(http, 'put').and.returnValue(Observable.of(new Response(res)));
      let resp: UserLocation;
      service.updateLocation(USER_LOCATION_COORDINATES).subscribe((response: UserLocation) => {
        resp = response;
      });
      expect(http.put).toHaveBeenCalledWith('api/v3/users/me/location', {
        latitude: USER_LOCATION_COORDINATES.latitude,
        longitude: USER_LOCATION_COORDINATES.longitude
      });
      expect(resp).toEqual(USER_LOCATION);
    });
  });

  describe('updateStoreLocation', () => {
    it('should call endpoint and return response', () => {
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(USER_LOCATION) });
      spyOn(http, 'post').and.returnValue(Observable.of(new Response(res)));
      let resp: UserLocation;

      service.updateStoreLocation(USER_LOCATION_COORDINATES).subscribe();

      expect(http.post).toHaveBeenCalledWith('api/v3/users/me/bumped-profile/store-location', {
        latitude: USER_LOCATION_COORDINATES.latitude,
        longitude: USER_LOCATION_COORDINATES.longitude,
        address: USER_LOCATION_COORDINATES.name
      });
    });
  });

  describe('getStats', () => {
    it('should call endpoint and return response', () => {
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(USERS_STATS) });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      let resp: UserStatsResponse;
      service.getStats().subscribe((response: UserStatsResponse) => {
        resp = response;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/users/me/stats');
      expect(resp).toEqual(USERS_STATS_RESPONSE);
    });
  });

  describe('getUserStats', () => {
    it('should call endpoint and return response', () => {
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(USERS_STATS) });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      let resp: UserStatsResponse;
      service.getUserStats(USER_ID).subscribe((response: UserStatsResponse) => {
        resp = response;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/users/' + USER_ID + '/stats');
      expect(resp).toEqual(USERS_STATS_RESPONSE);
    });
  });

  describe('getPhoneInfo', () => {
    it('should call endpoint GET phone info and return response', () => {
      const PHONE_METHOD_RESPONSE = { phone_method: 'bubble' };

      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getPhoneInfo(USER_ID).subscribe(response => expect(response).toEqual(PHONE_METHOD_RESPONSE));

      const req = httpTestingController.expectOne(`${environment.baseUrl}api/v3/users/${USER_ID}/phone-method`);
      expect(req.request.method).toEqual('GET');
      req.flush(PHONE_METHOD_RESPONSE);
    });

    it('should return null if endpoint GET phone info return error', () => {
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getPhoneInfo(USER_ID).subscribe(response => expect(response).toEqual(null));

      const req = httpTestingController.expectOne(`${environment.baseUrl}api/v3/users/${USER_ID}/phone-method`);
      expect(req.request.method).toEqual('GET');
      req.error(new ErrorEvent('network error'));
    });
  });

  describe('edit', () => {
    it('should call endpoint, return user and set it', () => {
      const res: ResponseOptions = new ResponseOptions({ body: USER_DATA });
      spyOn(http, 'post').and.returnValue(Observable.of(new Response(res)));
      spyOn<any>(service, 'mapRecordData').and.returnValue(MOCK_USER);
      let resp: User;

      service.edit(USER_EDIT_DATA).subscribe((user: User) => {
        resp = user;
      });
      expect(http.post).toHaveBeenCalledWith('api/v3/users/me', USER_EDIT_DATA);
      expect(resp).toEqual(MOCK_USER);
      expect(service['_user']).toEqual(MOCK_USER);
    });
  });

  describe('updateEmail', () => {
    it('should call endpoint', () => {
      const res: ResponseOptions = new ResponseOptions({ body: '' });
      spyOn(http, 'post').and.returnValue(Observable.of(new Response(res)));

      service.updateEmail(USER_EMAIL).subscribe();

      expect(http.post).toHaveBeenCalledWith('api/v3/users/me/email', {
        email_address: USER_EMAIL
      });
    });
  });

  describe('updatePassword', () => {
    it('should call endpoint', () => {
      const res: ResponseOptions = new ResponseOptions({ body: '' });
      spyOn(http, 'post').and.returnValue(Observable.of(new Response(res)));
      const OLD_PASSWORD = 'old';
      const NEW_PASSWORD = 'new';

      service.updatePassword(OLD_PASSWORD, NEW_PASSWORD).subscribe();

      expect(http.post).toHaveBeenCalledWith('api/v3/users/me/password', {
        old_password: OLD_PASSWORD,
        new_password: NEW_PASSWORD
      });
    });
  });

  describe('getUnsubscribeReasons', () => {
    it('should call endpoint and return response', () => {
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(REASONS) });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let resp: UnsubscribeReason[];

      service.getUnsubscribeReasons().subscribe((response: UnsubscribeReason[]) => {
        resp = response;
      });

      expect(http.get).toHaveBeenCalledWith('api/v3/users/me/unsubscribe/reason', { language: 'en' });
      expect(resp).toEqual(REASONS);
    });
  });

  describe('unsubscribe', () => {
    it('should call endpoint', () => {
      const res: ResponseOptions = new ResponseOptions({ body: '' });
      spyOn(http, 'post').and.returnValue(Observable.of(new Response(res)));

      service.unsubscribe(SELECTED_REASON, CUSTOM_REASON).subscribe();

      expect(http.post).toHaveBeenCalledWith('api/v3/users/me/unsubscribe', {
        reason_id: SELECTED_REASON,
        other_reason: CUSTOM_REASON
      });
    });
  });

  describe('setPermission', () => {
    it('should call addPermission', () => {
      spyOn(permissionService, 'addPermission').and.returnValue({});

      service.setPermission('normal');

      expect(permissionService.addPermission).toHaveBeenCalledWith(PERMISSIONS['normal']);
    });
  });

  describe('isProfessional', () => {
    let val: boolean;

    beforeEach(() => {
      spyOn(service, 'me').and.returnValue(Observable.of({}));
      spyOn(permissionService, 'hasPermission').and.returnValue(Promise.resolve(true));

      service.isProfessional().subscribe((v) => {
        val = v;
      });
    });

    it('should call me', () => {
      expect(service.me).toHaveBeenCalled();
    });

    it('should call hasPermission', () => {
      expect(permissionService.hasPermission).toHaveBeenCalledWith(PERMISSIONS.professional);
    });

    it('should return true', () => {
      expect(val).toBe(true);
    });
  });

  describe('isProUser', () => {
    it('should return true if user is professional', () => {
      spyOn(service, 'isProfessional').and.returnValue(Observable.of(true));
      spyOn(service, 'getMotorPlan').and.returnValue(Observable.of({}));
      spyOn(service, 'me').and.returnValue(Observable.of(MOCK_USER));

      let resp: boolean;

      service.isProUser().subscribe(response => resp = response);

      expect(resp).toBe(true);
    });

    it('should return true if there is a motor plan', () => {
      spyOn(service, 'isProfessional').and.returnValue(Observable.of(false));
      spyOn(service, 'getMotorPlan').and.returnValue(Observable.of(mockMotorPlan));
      spyOn(service, 'me').and.returnValue(Observable.of(MOCK_USER));

      let resp: boolean;

      service.isProUser().subscribe(response => resp = response);

      expect(resp).toBe(true);
    });

    it('should return true if user is featured', () => {
      spyOn(service, 'isProfessional').and.returnValue(Observable.of(false));
      spyOn(service, 'getMotorPlan').and.returnValue(Observable.of({}));
      spyOn(service, 'me').and.returnValue(Observable.of(MOCK_FULL_USER));

      let resp: boolean;

      service.isProUser().subscribe(response => resp = response);

      expect(resp).toBe(true);
    });

    it('should return false if there is not a motor plan and user is not professional', () => {
      spyOn(service, 'isProfessional').and.returnValue(Observable.of(false));
      spyOn(service, 'getMotorPlan').and.returnValue(Observable.of({}));
      spyOn(service, 'me').and.returnValue(Observable.of(MOCK_USER));

      let resp: boolean;

      service.isProUser().subscribe(response => resp = response);

      expect(resp).toBe(false);
    });
  });

  describe('getMotorPlan', () => {

    it('should retrieve and return the Motor plan object', fakeAsync(() => {
      spyOn(http, 'get').and.callThrough();
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toBe(environment.baseUrl + 'api/v3/users/me/profile-subscription-info/type');
        const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(MOTORPLAN_DATA) });
        connection.mockRespond(new Response(res));
      });
      let motorPlan: MotorPlan;

      service.getMotorPlan().subscribe((r: MotorPlan) => {
        motorPlan = r;
      });

      expect(http.get).toHaveBeenCalled();
      expect(motorPlan.subtype).toEqual('sub_premium');
    }));

    it('should return the MotorPlan object if present', fakeAsync(() => {
      let motorPlan: MotorPlan;
      spyOn(http, 'get');

      service['_motorPlan'] = mockMotorPlan;
      service.getMotorPlan().subscribe((r: MotorPlan) => {
        motorPlan = r;
      });

      expect(motorPlan.subtype).toBe('sub_premium');
      expect(http.get).not.toHaveBeenCalled();
    }));

    it('should call http only once', () => {
      spyOn(http, 'get').and.callThrough();

      service.getMotorPlan().subscribe();
      service.getMotorPlan().subscribe();

      expect(http.get).toHaveBeenCalledTimes(1);
    });

  });

  describe('getMotorPlans', () => {
    it('should call endpoint GET motor plans and return response', () => {
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getMotorPlans().subscribe(response => expect(response).toEqual(PROFILE_SUB_INFO));

      const req = httpTestingController.expectOne(`${environment.baseUrl}api/v3/users/me/profile-subscription-info`);

      expect(req.request.method).toEqual('GET');
      req.flush(PROFILE_SUB_INFO);
    });
  });

  describe('reportUser', () => {
    it('should check parameters of request to report user', () => {
      const CONVERSATIONS_HASH = 'vdqjwyk1kzon';
      const ITEM_HASH = '9ke65g542jox';
      const REASON = 5;
      const COMMENT = 'bla bla bla';
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.reportUser(USER_ID, ITEM_HASH, CONVERSATIONS_HASH, REASON, COMMENT).subscribe();

      const req = httpTestingController.expectOne(`${environment.baseUrl}api/v3/users/me/report/user/${USER_ID}`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({
        itemHashId: ITEM_HASH,
        conversationHash: CONVERSATIONS_HASH,
        comments: COMMENT,
        reason: REASON
      });
      expect(req.request.headers.get('AppBuild')).toEqual(APP_VERSION);
    });
  });

  describe('setSubscriptionsFeatureFlag', () => {
    it('should call getFlag and add permission if active', () => {
      spyOn(featureflagService, 'getFlag').and.callThrough();

      service.setSubscriptionsFeatureFlag();

      expect(featureflagService.getFlag).toHaveBeenCalledWith(FEATURE_FLAGS_ENUM.SUBSCRIPTIONS);
    });
  });
});
