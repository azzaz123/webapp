
import {of as observableOf,  Observable } from 'rxjs';
import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { UserService, LOGIN_ENDPOINT, LOGOUT_ENDPOINT, USER_ONLINE_ENDPOINT, PROTOOL_EXTRA_INFO_ENDPOINT, USER_LOCATION_ENDPOINT, USER_STORE_LOCATION_ENDPOINT, USER_STATS_ENDPOINT, USER_STATS_BY_ID_ENDPOINT, USER_ENDPOINT, USER_EMAIL_ENDPOINT, USER_PASSWORD_ENDPOINT, USER_UNSUBSCRIBE_REASONS_ENDPOINT, USER_UNSUBSCRIBE_ENDPOINT, USER_PROFILE_SUBSCRIPTION_INFO_TYPE_ENDPOINT, USER_BY_ID_ENDPOINT, USER_PROFILE_SUBSCRIPTION_INFO_ENDPOINT, USER_REPORT_ENDPOINT, USER_COVER_IMAGE_ENDPOINT, USER_PHONE_INFO_ENDPOINT, USER_EXTRA_INFO_ENDPOINT } from './user.service';
import { HaversineService } from 'ng2-haversine';
import { ITEM_LOCATION, MOCK_ITEM } from '../../../tests/item.fixtures.spec';
import { Item } from '../item/item';
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
  MOCK_UNSUBSCRIBE_REASONS,
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
import { APP_VERSION } from '../../../environments/version';
import { PhoneMethod } from '../../chat/model';
import { HttpParams, HttpRequest } from '@angular/common/http';

describe('Service: User', () => {

  let service: UserService;
  let haversineService: HaversineService;
  const FAKE_USER_NAME = 'No disponible';
  let accessTokenService: AccessTokenService;
  let event: EventService;
  let cookieService: CookieService;
  let permissionService: NgxPermissionsService;
  let featureflagService: FeatureflagService;
  let splitTestService: SplitTestService;
  let httpMock: HttpTestingController;
  let eventService: EventService;

  const mockMotorPlan = {
    type: 'motor_plan_pro',
    subtype: 'sub_premium'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        EventService,
        UserService,
        I18nService,
        HaversineService,
        AccessTokenService,
        {
          provide: 'SUBDOMAIN', useValue: 'www'
        },
        {
          provide: CookieService,
          useValue: {
            cookies: {},
            get(key) {
              return this.cookies[key];
            },
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
              return observableOf(true);
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
    haversineService = TestBed.get(HaversineService);
    accessTokenService = TestBed.get(AccessTokenService);
    accessTokenService.storeAccessToken(null);
    event = TestBed.get(EventService);
    cookieService = TestBed.get(CookieService);
    permissionService = TestBed.get(NgxPermissionsService);
    featureflagService = TestBed.get(FeatureflagService);
    splitTestService = TestBed.get(SplitTestService);
    httpMock = TestBed.get(HttpTestingController);
    eventService = TestBed.get(EventService);
  });

  afterEach(() => {
    httpMock.verify();
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
    describe('when there are no users stored', () => {
      it('should ask backend and return user', () => {
        let response: User;

        service.get(USER_ID).subscribe(r => response = r);
        const req = httpMock.expectOne(`${environment.baseUrl}${USER_BY_ID_ENDPOINT(USER_ID)}`);
        req.flush(USER_DATA);

        expect(req.request.method).toBe('GET');
        expect(response).toEqual(MOCK_FULL_USER);
      });
    });

    describe('when there are users stored', () => {
      it('should not ask backend and return user from memory', () => {
        let response: User;

        service.get(USER_ID).subscribe();
        httpMock.expectOne(`${environment.baseUrl}${USER_BY_ID_ENDPOINT(USER_ID)}`).flush(USER_DATA);
        service.get(USER_ID).subscribe(r => response = r);
        httpMock.expectNone(`${environment.baseUrl}${USER_BY_ID_ENDPOINT(USER_ID)}`);

        expect(response).toEqual(MOCK_FULL_USER);
      });
    })

    describe('when there is an error from backend', () => {
      it('should return a fake User object', () => {
        let response: User;

        service.get(USER_ID).subscribe(r => response = r);
        httpMock.expectOne(`${environment.baseUrl}${USER_BY_ID_ENDPOINT(USER_ID)}`)
          .flush({}, { status: 500, statusText: 'Server error' });

        expect(response.id).toBe(USER_ID);
        expect(response.microName).toBe(FAKE_USER_NAME);
      });
    });
  });

  describe('me', () => {
    describe('when there is no user stored', () => {
      it('should ask backend', () => {
        let response: User;

        service.me().subscribe(r => response = r);
        const req = httpMock.expectOne(`${environment.baseUrl}${USER_ENDPOINT}`);
        req.flush(USER_DATA);

        expect(req.request.method).toBe('GET');
        expect(response).toEqual(MOCK_FULL_USER);
      });

      // TODO: This should change when parsing error status from backend (once permission factory is migrated)
      describe('and there is error from backend', () => {
        it('should logout user', () => {
          spyOn(service, 'logoutLocal');

          service.me().subscribe();
          const req = httpMock.expectOne(`${environment.baseUrl}${USER_ENDPOINT}`);
          req.flush({}, { status: 401, statusText: 'Unauthorized' });
  
          expect(service.logoutLocal).toHaveBeenCalledTimes(1);
        });
      })
    })

    describe('when there is user stored', () => {
      it('should return user from memory', () => {
        let response: User;

        service.me().subscribe();
        httpMock.expectOne(`${environment.baseUrl}${USER_ENDPOINT}`).flush(USER_DATA);
        service.me().subscribe(r => response = r);
        httpMock.expectNone(`${environment.baseUrl}${USER_ENDPOINT}`);

        expect(response).toEqual(MOCK_FULL_USER);
      });
    })
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
    const onlineUrl = `${environment.baseUrl}${USER_ONLINE_ENDPOINT}`;

    beforeEach(() => {
      spyOn(permissionService, 'flushPermissions').and.returnValue({});
      spyOn(accessTokenService, 'deleteAccessToken').and.callThrough();
      accessTokenService.storeAccessToken('abc');
    });

    it('should call the me/online endpoint ONCE when the client connects and then every <intervalValue> milliseconds', fakeAsync(() => {
      service.sendUserPresenceInterval(intervalValue);
      tick(intervalValue * callTimes);
      let requests = httpMock.match(onlineUrl);
      requests.forEach(request => request.flush({}));
      
      expect(requests.length).toBe(callTimes + 1);
      discardPeriodicTasks();
    }));

    it('should call the me/online endpoint ONCE when the client connects and stop after the user has logged out', fakeAsync(() => {
      service.sendUserPresenceInterval(intervalValue);
      tick(intervalValue * callTimes);
      service.logout();
      httpMock.expectOne(`${environment.siteUrl.replace('es', 'www')}${LOGOUT_ENDPOINT}`).flush({});
      tick(intervalValue * 4);
      let requests = httpMock.match(onlineUrl);
      requests.forEach(request => request.flush({}));

      expect(requests.length).toBe(callTimes + 1);
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
    const FORM_INPUT = {
      emailAddress: 'test@test.it',
      installationType: 'ANDROID',
      password: 'test'
    };

    it('should send user login request to backend', () => {
      const expectedBody = new HttpParams()
        .set('emailAddress', FORM_INPUT.emailAddress)
        .set('installationType', FORM_INPUT.installationType)
        .set('password', FORM_INPUT.password)
        .toString();

      service.login(FORM_INPUT).subscribe(r => response = r);
      const req = httpMock.expectOne(`${environment.baseUrl}${LOGIN_ENDPOINT}`);
      req.flush(MOCK_USER_RESPONSE_BODY);

      expect(req.request.method).toBe('POST');
      expect(req.request.body.toString()).toEqual(expectedBody);
    });

    it('should store token when backend has responded', () => {
      spyOn(accessTokenService, 'storeAccessToken');

      service.login(FORM_INPUT).subscribe();
      const req = httpMock.expectOne(`${environment.baseUrl}${LOGIN_ENDPOINT}`);
      req.flush(MOCK_USER_RESPONSE_BODY);

      expect(accessTokenService.storeAccessToken).toHaveBeenCalledWith(MOCK_USER_RESPONSE_BODY.token);
    });

    it('should emit event when user logged in successfuly', () => {
      spyOn(eventService, 'emit').and.callThrough();

      service.login(FORM_INPUT).subscribe();
      const req = httpMock.expectOne(`${environment.baseUrl}${LOGIN_ENDPOINT}`);
      req.flush(MOCK_USER_RESPONSE_BODY);

      expect(eventService.emit).toHaveBeenCalledWith(EventService.USER_LOGIN, MOCK_USER_RESPONSE_BODY.token);
    })
  });

  describe('logout', () => {
    const expectedUrl = `${environment.siteUrl.replace('es', 'www')}${LOGOUT_ENDPOINT}`;
    const logoutResponse = 'redirect_url';
    let redirectUrl: string;
    let req: TestRequest;

    beforeEach(() => {
      spyOn(permissionService, 'flushPermissions').and.returnValue({});
      spyOn(accessTokenService, 'deleteAccessToken').and.callThrough();
      spyOn(splitTestService, 'reset');
      accessTokenService.storeAccessToken('token')

      event.subscribe(EventService.USER_LOGOUT, param => redirectUrl = param);
      cookieService.put('publisherId', 'someId');

      service.logout();
      req = httpMock.expectOne(expectedUrl);
      req.flush(logoutResponse);
    });

    it('should call logout endpoint', () => {
      expect(req.request.method).toBe('POST');
      expect(req.request.urlWithParams).toEqual(expectedUrl)
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

      const req = httpMock.expectOne(`${environment.baseUrl}${USER_EXTRA_INFO_ENDPOINT(USER_ID)}`);

      expect(req.request.method).toEqual('GET');
      req.flush(USER_INFO_RESPONSE);
    });
  });

  describe('getProInfo', () => {
    it('should call endpoint GET phone info and return response', () => {
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getProInfo().subscribe(response => expect(response).toEqual(USER_PRO_INFO_RESPONSE));

      const req = httpMock.expectOne(`${environment.baseUrl}${PROTOOL_EXTRA_INFO_ENDPOINT}`);

      expect(req.request.method).toEqual('GET');
      req.flush(USER_PRO_INFO_RESPONSE);
    });
  });

  describe('getUserCover', () => {
    it('should call endpoint GET user cover and return response', () => {
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getUserCover().subscribe(response => expect(response).toEqual(IMAGE));

      const req = httpMock.expectOne(`${environment.baseUrl}${USER_COVER_IMAGE_ENDPOINT}`);
      expect(req.request.method).toEqual('GET');
      req.flush(IMAGE);
    });

    it('should return empty object if endpoint return error', () => {
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getUserCover().subscribe(response => expect(response).toEqual({} as Image));

      const req = httpMock.expectOne(`${environment.baseUrl}${USER_COVER_IMAGE_ENDPOINT}`);
      expect(req.request.method).toEqual('GET');
      req.error(new ErrorEvent('network error'));
    });
  });

  describe('updateProInfo', () => {
    it('should call endpoint', () => {
      const expectedUrl = `${environment.baseUrl}${PROTOOL_EXTRA_INFO_ENDPOINT}`;

      service.updateProInfo(USER_PRO_DATA).subscribe();
      const req = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(USER_PRO_DATA);
    });
  });

  describe('updateLocation', () => {
    it('should call endpoint and return response', () => {
      let response: UserLocation;
      
      service.updateLocation(USER_LOCATION_COORDINATES).subscribe(r => response = r);
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_LOCATION_ENDPOINT}`);
      req.flush(USER_LOCATION);

      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({
        latitude: USER_LOCATION_COORDINATES.latitude,
        longitude: USER_LOCATION_COORDINATES.longitude
      });
      expect(response).toEqual(USER_LOCATION);
    });
  });

  describe('updateStoreLocation', () => {
    it('should call endpoint and return response', () => {
      let response: UserLocation;

      service.updateStoreLocation(USER_LOCATION_COORDINATES).subscribe(r => response = r);
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_STORE_LOCATION_ENDPOINT}`);
      req.flush(USER_LOCATION);

      expect(req.request.method).toBe('POST')
      expect(req.request.body).toEqual({
        latitude: USER_LOCATION_COORDINATES.latitude,
        longitude: USER_LOCATION_COORDINATES.longitude,
        address: USER_LOCATION_COORDINATES.name
      });
      expect(response).toEqual(USER_LOCATION);
    });
  });

  describe('getStats', () => {
    it('should call endpoint and return response', () => {
      const backendResponse = USERS_STATS;
      let response: UserStatsResponse;

      service.getStats().subscribe(r => response = r);
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_STATS_ENDPOINT}`);
      req.flush(backendResponse);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(USERS_STATS_RESPONSE);
    });
  });

  describe('getUserStats', () => {
    it('should call endpoint and return response', () => {
      const backendResponse = USERS_STATS;
      let response: UserStatsResponse;

      service.getUserStats(USER_ID).subscribe(r => response = r);
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_STATS_BY_ID_ENDPOINT(USER_ID)}`);
      req.flush(backendResponse);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(USERS_STATS_RESPONSE);
    });
  });

  describe('getPhoneInfo', () => {
    it('should call endpoint GET phone info and return response', () => {
      const PHONE_METHOD_RESPONSE = { phone_method: PhoneMethod.CHAT_MESSAGE };

      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getPhoneInfo(USER_ID).subscribe(response => expect(response).toEqual(PHONE_METHOD_RESPONSE));

      const req = httpMock.expectOne(`${environment.baseUrl}${USER_PHONE_INFO_ENDPOINT(USER_ID)}`);
      expect(req.request.method).toEqual('GET');
      req.flush(PHONE_METHOD_RESPONSE);
    });

    it('should return null if endpoint GET phone info return error', () => {
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getPhoneInfo(USER_ID).subscribe(response => expect(response).toEqual(null));

      const req = httpMock.expectOne(`${environment.baseUrl}${USER_PHONE_INFO_ENDPOINT(USER_ID)}`);
      expect(req.request.method).toEqual('GET');
      req.error(new ErrorEvent('network error'));
    });
  });

  describe('edit', () => {
    it('should call endpoint, return user and set it', () => {
      const backendResponse = USER_DATA;
      let response: User;

      service.edit(USER_EDIT_DATA).subscribe(r => response = r);
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_ENDPOINT}`);
      req.flush(backendResponse);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(USER_EDIT_DATA);

      expect(response).toEqual(MOCK_FULL_USER);
      expect(service.user).toEqual(MOCK_FULL_USER);
    });
  });

  describe('updateEmail', () => {
    it('should call endpoint', () => {
      const expectedBody = { email_address: USER_EMAIL };

      service.updateEmail(USER_EMAIL).subscribe();
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_EMAIL_ENDPOINT}`);
      req.flush({});

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);
    });
  });

  describe('updatePassword', () => {
    it('should call endpoint', () => {
      const OLD_PASSWORD = 'outwiththeold';
      const NEW_PASSWORD = 'inwiththenew';
      const expectedBody = {
        old_password: OLD_PASSWORD,
        new_password: NEW_PASSWORD
      }

      service.updatePassword(OLD_PASSWORD, NEW_PASSWORD).subscribe();
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_PASSWORD_ENDPOINT}`)
      req.flush({});

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);
    });
  });

  describe('getUnsubscribeReasons', () => {
    it('should call endpoint with language as query param and return response', () => {
      const languageParamKey = 'language';
      const languageParamValue = 'en';
      const expectedParams = new HttpParams().set(languageParamKey, languageParamValue);
      const expectedUrl = `${environment.baseUrl}${USER_UNSUBSCRIBE_REASONS_ENDPOINT}?${expectedParams.toString()}`;
      let response: UnsubscribeReason[];

      service.getUnsubscribeReasons().subscribe(r => response = r);
      const req = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_UNSUBSCRIBE_REASONS);

      const languageParam = req.request.params.get(languageParamKey)
      expect(req.request.method).toBe('GET');
      expect(languageParam).toEqual(languageParamValue);
      expect(response).toEqual(MOCK_UNSUBSCRIBE_REASONS);
    });
  });

  describe('unsubscribe', () => {
    it('should call endpoint', () => {
      const expectedBody = { reason_id: SELECTED_REASON, other_reason: CUSTOM_REASON };

      service.unsubscribe(SELECTED_REASON, CUSTOM_REASON).subscribe();
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_UNSUBSCRIBE_ENDPOINT}`)
      req.flush({});

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);
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
      spyOn(service, 'me').and.returnValue(observableOf({}));
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
      spyOn(service, 'isProfessional').and.returnValue(observableOf(true));
      spyOn(service, 'getMotorPlan').and.returnValue(observableOf({}));
      spyOn(service, 'me').and.returnValue(observableOf(MOCK_USER));

      let resp: boolean;

      service.isProUser().subscribe(response => resp = response);

      expect(resp).toBe(true);
    });

    it('should return true if there is a motor plan', () => {
      spyOn(service, 'isProfessional').and.returnValue(observableOf(false));
      spyOn(service, 'getMotorPlan').and.returnValue(observableOf(mockMotorPlan));
      spyOn(service, 'me').and.returnValue(observableOf(MOCK_USER));

      let resp: boolean;

      service.isProUser().subscribe(response => resp = response);

      expect(resp).toBe(true);
    });

    it('should return true if user is featured', () => {
      spyOn(service, 'isProfessional').and.returnValue(observableOf(false));
      spyOn(service, 'getMotorPlan').and.returnValue(observableOf({}));
      spyOn(service, 'me').and.returnValue(observableOf(MOCK_FULL_USER));

      let resp: boolean;

      service.isProUser().subscribe(response => resp = response);

      expect(resp).toBe(true);
    });

    it('should return false if there is not a motor plan and user is not professional', () => {
      spyOn(service, 'isProfessional').and.returnValue(observableOf(false));
      spyOn(service, 'getMotorPlan').and.returnValue(observableOf({}));
      spyOn(service, 'me').and.returnValue(observableOf(MOCK_USER));

      let resp: boolean;

      service.isProUser().subscribe(response => resp = response);

      expect(resp).toBe(false);
    });
  });

  describe('getMotorPlan', () => {
    const expectedMotorPlanUrl = `${environment.baseUrl}${USER_PROFILE_SUBSCRIPTION_INFO_TYPE_ENDPOINT}`;

    it('should retrieve and return the Motor plan object', fakeAsync(() => {
      let response: MotorPlan;

      service.getMotorPlan().subscribe(r => response = r);
      const req = httpMock.expectOne(expectedMotorPlanUrl);
      req.flush(MOTORPLAN_DATA);

      expect(req.request.method).toBe('GET');
      expect(response.subtype).toEqual(MOTORPLAN_DATA.subtype);
    }));

    it('should do only one petition to backend', () => {
      let response: MotorPlan;
      let response2: MotorPlan;

      service.getMotorPlan().subscribe(r => response = r);
      const req = httpMock.expectOne(expectedMotorPlanUrl);
      req.flush(MOTORPLAN_DATA);

      service.getMotorPlan().subscribe(r => response2 = r);
      httpMock.expectNone(expectedMotorPlanUrl);

      expect(response).toEqual(MOTORPLAN_DATA);
      expect(response2).toEqual(MOTORPLAN_DATA);
      expect(response2).toBe(response);
    });
  });

  describe('getMotorPlans', () => {
    it('should call endpoint GET motor plans and return response', () => {
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getMotorPlans().subscribe(response => expect(response).toEqual(PROFILE_SUB_INFO));

      const req = httpMock.expectOne(`${environment.baseUrl}${USER_PROFILE_SUBSCRIPTION_INFO_ENDPOINT}`);

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

      const req = httpMock.expectOne(`${environment.baseUrl}${USER_REPORT_ENDPOINT(USER_ID)}`);
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
