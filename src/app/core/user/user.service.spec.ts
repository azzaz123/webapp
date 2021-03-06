import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import { I18nService } from '@core/i18n/i18n.service';
import { MockReleaseVersion } from '@core/release-version/release-version.fixtures.spec';
import { ReleaseVersionService } from '@core/release-version/release-version.service';
import { environment } from '@environments/environment';
import { PhoneMethod } from '@private/features/chat/core/model';
import { ITEM_LOCATION } from '@fixtures/item.fixtures.spec';
import {
  CUSTOM_REASON,
  IMAGE,
  MOCK_FULL_USER,
  MOCK_UNSUBSCRIBE_REASONS,
  MOCK_USER,
  MOCK_USER_STATS,
  SELECTED_REASON,
  USER_DATA,
  USER_EDIT_DATA,
  USER_EMAIL,
  USER_ID,
  USER_INFO_RESPONSE,
  USER_LOCATION,
  USER_LOCATION_COORDINATES,
  USER_PRO_DATA,
  USER_PRO_INFO_RESPONSE,
  USERS_STATS,
} from '@fixtures/user.fixtures.spec';
import { CookieService } from 'ngx-cookie';
import { NgxPermissionsService } from 'ngx-permissions';
import { of } from 'rxjs';
import { EventService } from '../event/event.service';
import { UnsubscribeReason } from './unsubscribe-reason.interface';
import { User } from './user';
import { Image, UserLocation } from './user-response.interface';
import { UserStats } from './user-stats.interface';
import {
  LOCAL_STORAGE_CLICK_PRO_SECTION,
  LOCAL_STORAGE_TRY_PRO_SLOT,
  LOGOUT_ENDPOINT,
  PROTOOL_EXTRA_INFO_ENDPOINT,
  USER_BY_ID_ENDPOINT,
  USER_COVER_IMAGE_ENDPOINT,
  USER_EMAIL_ENDPOINT,
  USER_ENDPOINT,
  USER_EXTRA_INFO_ENDPOINT,
  USER_LOCATION_ENDPOINT,
  USER_ONLINE_ENDPOINT,
  USER_PASSWORD_ENDPOINT,
  USER_PHONE_INFO_ENDPOINT,
  USER_STATS_BY_ID_ENDPOINT,
  USER_STATS_ENDPOINT,
  USER_STORE_LOCATION_ENDPOINT,
  USER_UNSUBSCRIBE_ENDPOINT,
  USER_UNSUBSCRIBE_REASONS_ENDPOINT,
  UserService,
} from './user.service';
import { PERMISSIONS } from './user-constants';
import { LOCALE_ID } from '@angular/core';
import { StoreLocation, StoreLocationResponse } from '@core/geolocation/address-response.interface';
import { cloneDeep } from 'lodash-es';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { mParticle } from '@core/analytics/mparticle.constants';
import { UserIdentities } from '@mparticle/web-sdk';

jest.mock('@core/analytics/mparticle.constants', () => ({
  mParticle: {
    Identity: {
      logout: () => null,
    },
  },
}));

describe('Service: User', () => {
  let service: UserService;
  const FAKE_USER_NAME = 'No disponible';
  let accessTokenService: AccessTokenService;
  let event: EventService;
  let cookieService: CookieService;
  let releaseVersionService: ReleaseVersionService;
  let permissionService: NgxPermissionsService;
  let httpMock: HttpTestingController;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EventService,
        UserService,
        I18nService,
        AccessTokenService,
        {
          provide: ReleaseVersionService,
          useValue: {
            getReleaseVersion() {
              return MockReleaseVersion;
            },
          },
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
            },
          },
        },
        {
          provide: NgxPermissionsService,
          useValue: {
            addPermission() {},
            flushPermissions() {},
            hasPermission() {},
          },
        },
        { provide: LOCALE_ID, useValue: 'en' },
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
      ],
    });
    service = TestBed.inject(UserService);
    accessTokenService = TestBed.inject(AccessTokenService);
    accessTokenService.storeAccessToken(null);
    releaseVersionService = TestBed.inject(ReleaseVersionService);
    event = TestBed.inject(EventService);
    cookieService = TestBed.inject(CookieService);
    permissionService = TestBed.inject(NgxPermissionsService);
    httpMock = TestBed.inject(HttpTestingController);
    eventService = TestBed.inject(EventService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  describe('isLogged', () => {
    it('should not be logged', () => {
      expect(service.isLogged).toBeFalsy();
    });

    it('should be logged', () => {
      accessTokenService.storeAccessToken('abc');
      expect(service.isLogged).toBe(true);
    });
  });

  describe('getLoggedUserInformation', () => {
    it('should retrive the information from the logged user', () => {
      let response: User;

      service.getLoggedUserInformation().subscribe((r) => (response = r));
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_ENDPOINT}`);
      req.flush(USER_DATA);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_FULL_USER);
    });
  });

  describe('initializeUser', () => {
    it('should save the logged user information', () => {
      service.initializeUser();
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_ENDPOINT}`);
      req.flush(USER_DATA);

      expect(service.user).toEqual(MOCK_FULL_USER);
    });

    describe('when the user information cannot be retrieved', () => {
      it('should logout the user', () => {
        accessTokenService.storeAccessToken('abc');
        spyOn(service, 'logout');

        service.initializeUser();
        const req = httpMock.expectOne(`${environment.baseUrl}${USER_ENDPOINT}`);
        req.error(null, { status: 0, statusText: 'Unauthorized' });

        expect(service.logout).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('get', () => {
    describe('when there are no users in local cache', () => {
      it('should get user from server', () => {
        let response: User;

        service.get(USER_ID).subscribe((r) => (response = r));
        const req = httpMock.expectOne(`${environment.baseUrl}${USER_BY_ID_ENDPOINT(USER_ID)}`);
        req.flush(USER_DATA);

        expect(req.request.method).toBe('GET');
        expect(response).toEqual(MOCK_FULL_USER);
      });
    });

    describe('when there are users in local cache', () => {
      beforeEach(() => {
        service.get(USER_ID).subscribe();
        httpMock.expectOne(`${environment.baseUrl}${USER_BY_ID_ENDPOINT(USER_ID)}`).flush(USER_DATA);
      });

      it('should get user from local cache', () => {
        let response: User;

        service.get(USER_ID).subscribe((r) => (response = r));
        httpMock.expectNone(`${environment.baseUrl}${USER_BY_ID_ENDPOINT(USER_ID)}`);

        expect(response).toEqual(MOCK_FULL_USER);
      });

      describe('and when specifying to not use local cache', () => {
        it('should get user from server', () => {
          let response: User;

          service.get(USER_ID, false).subscribe((r) => (response = r));
          const req = httpMock.expectOne(`${environment.baseUrl}${USER_BY_ID_ENDPOINT(USER_ID)}`);
          req.flush(USER_DATA);

          expect(req.request.method).toBe('GET');
          expect(response).toEqual(MOCK_FULL_USER);
        });
      });
    });

    describe('when there is an error from backend', () => {
      it('should return a fake User object', () => {
        let response: User;

        service.get(USER_ID).subscribe((r) => (response = r));
        httpMock.expectOne(`${environment.baseUrl}${USER_BY_ID_ENDPOINT(USER_ID)}`).flush({}, { status: 500, statusText: 'Server error' });

        expect(response.id).toBe(USER_ID);
        expect(response.microName).toBe(FAKE_USER_NAME);
      });
    });
  });

  describe('getLoggedUserInformation', () => {
    it('should retrieve the information about the logged user', () => {
      let response: User;

      service.getLoggedUserInformation().subscribe((r) => (response = r));
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_ENDPOINT}`);
      req.flush(USER_DATA);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_FULL_USER);
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
      requests.forEach((request) => request.flush({}));

      expect(requests.length).toBe(callTimes + 1);
      discardPeriodicTasks();
    }));

    it('should call the me/online endpoint ONCE when the client connects and stop after the user has logged out', fakeAsync(() => {
      service.sendUserPresenceInterval(intervalValue);
      tick(intervalValue * callTimes);
      accessTokenService.deleteAccessToken();
      tick(intervalValue * 4);
      let requests = httpMock.match(onlineUrl);
      requests.forEach((request) => request.flush({}));

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

  describe('logout', () => {
    let redirectUrl: string;

    beforeEach(() => {
      spyOn(permissionService, 'flushPermissions').and.returnValue({});
      spyOn(accessTokenService, 'deleteAccessToken').and.callThrough();

      accessTokenService.storeAccessToken('token');
      event.subscribe(EventService.USER_LOGOUT, (param) => (redirectUrl = param));
      cookieService.put('publisherId', 'someId');
    });

    it('should call logout endpoint', () => {
      const expectedUrl = `${environment.baseUrl}${LOGOUT_ENDPOINT}`;
      const deviceAccessToken = accessTokenService.deviceAccessToken;

      service.logout().subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toEqual(expectedUrl);
      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.get('DeviceAccessToken')).toEqual(deviceAccessToken);
      expect(req.request.headers.get('DeviceOS')).toEqual('0');
      expect(req.request.headers.get('AppBuild')).toEqual(MockReleaseVersion);
    });

    it('should call deleteAccessToken and call event passing direct url and call flush permissions', () => {
      spyOn(mParticle.Identity, 'logout').and.callFake((userIdentities: UserIdentities, callback) => callback({ getUser: () => true }));
      const expectedUrl = `${environment.baseUrl}${LOGOUT_ENDPOINT}`;

      service.logout('redirect_url').subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(accessTokenService.deleteAccessToken).toHaveBeenCalled();
      expect(redirectUrl).toBe('redirect_url');
      expect(permissionService.flushPermissions).toHaveBeenCalled();
    });

    it('should call mparticle logout', () => {
      spyOn(mParticle.Identity, 'logout').and.callFake((userIdentities: UserIdentities, callback) => callback({ getUser: () => true }));
      const expectedUrl = `${environment.baseUrl}${LOGOUT_ENDPOINT}`;

      service.logout('redirect_url').subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(mParticle.Identity.logout).toHaveBeenCalledTimes(1);
      expect(redirectUrl).toBe('redirect_url');
    });

    it('should remove publisherId from cookie', () => {
      expect(cookieService['publisherId']).not.toBeDefined();
    });
  });

  describe('calculateDistanceFromItem', () => {
    describe('when the distance between users is the same...', () => {
      it('should return 0 distance', () => {
        const user: User = MOCK_USER;
        service['_user'] = new User(USER_ID, null, null, ITEM_LOCATION);

        const distance: number = service.calculateDistanceFromItem(user);

        expect(distance).toBe(0);
      });
    });

    describe('when the distance between users is different...', () => {
      it('should return positive number', () => {
        const CUSTOM_USER_LOCATION: UserLocation = {
          id: 101,
          approximated_latitude: 40.41340759767221,
          approximated_longitude: -3.6929970439968804,
          city: 'Barcelona',
          zip: '08009',
          approxRadius: 0,
          title: '08009, Barcelona',
        };
        const user: User = MOCK_USER;
        service['_user'] = new User(USER_ID, null, null, CUSTOM_USER_LOCATION);

        const distance: number = service.calculateDistanceFromItem(user);

        expect(distance > 0).toBeTruthy();
      });
    });

    describe('when our own user dont have location...', () => {
      it('should return null distance', () => {
        const user: User = new User(USER_ID);
        service['_user'] = new User(USER_ID);

        const distance: number = service.calculateDistanceFromItem(user);

        expect(distance).toBeNull();
      });
    });
  });

  describe('getInfo', () => {
    it('should call endpoint GET info and return response', () => {
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getInfo(USER_ID).subscribe((response) => expect(response).toEqual(USER_INFO_RESPONSE));

      const req = httpMock.expectOne(`${environment.baseUrl}${USER_EXTRA_INFO_ENDPOINT(USER_ID)}`);

      expect(req.request.method).toEqual('GET');
      req.flush(USER_INFO_RESPONSE);
    });
  });

  describe('getProInfo', () => {
    it('should call endpoint GET phone info and return response', () => {
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getProInfo().subscribe((response) => expect(response).toEqual(USER_PRO_INFO_RESPONSE));

      const req = httpMock.expectOne(`${environment.baseUrl}${PROTOOL_EXTRA_INFO_ENDPOINT}`);

      expect(req.request.method).toEqual('GET');
      req.flush(USER_PRO_INFO_RESPONSE);
    });
  });

  describe('getUserCover', () => {
    it('should call endpoint GET user cover and return response', () => {
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getUserCover().subscribe((response) => expect(response).toEqual(IMAGE));

      const req = httpMock.expectOne(`${environment.baseUrl}${USER_COVER_IMAGE_ENDPOINT}`);
      expect(req.request.method).toEqual('GET');
      req.flush(IMAGE);
    });

    it('should return empty object if endpoint return error', () => {
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getUserCover().subscribe((response) => expect(response).toEqual({} as Image));

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

      service.updateLocation(USER_LOCATION_COORDINATES).subscribe((r) => (response = r));
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_LOCATION_ENDPOINT}`);
      req.flush(USER_LOCATION);

      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({
        latitude: USER_LOCATION_COORDINATES.latitude,
        longitude: USER_LOCATION_COORDINATES.longitude,
      });
      expect(response).toEqual(USER_LOCATION);
    });
  });

  describe('updateStoreLocation', () => {
    it('should call endpoint and return response', () => {
      let response: StoreLocationResponse;

      const expectedResponse: StoreLocationResponse = {
        check_change_location: true,
      };

      const storeLocationRequest: StoreLocation = {
        latitude: 0,
        longitude: 0,
        address: 'aaaa',
      };

      service.updateStoreLocation(storeLocationRequest).subscribe((r) => (response = r));
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_STORE_LOCATION_ENDPOINT}`);
      req.flush(expectedResponse);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(storeLocationRequest);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getStats', () => {
    it('should call endpoint and return response', () => {
      const backendResponse = USERS_STATS;
      let response: UserStats;

      service.getStats().subscribe((r) => (response = r));
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_STATS_ENDPOINT}`);
      req.flush(backendResponse);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_USER_STATS);
    });
  });

  describe('getUserStats', () => {
    it('should call endpoint and return response', () => {
      const backendResponse = USERS_STATS;
      let response: UserStats;

      service.getUserStats(USER_ID).subscribe((r) => (response = r));
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_STATS_BY_ID_ENDPOINT(USER_ID)}`);
      req.flush(backendResponse);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_USER_STATS);
    });
  });

  describe('getPhoneInfo', () => {
    it('should call endpoint GET phone info and return response', () => {
      const PHONE_METHOD_RESPONSE = { phone_method: PhoneMethod.CHAT_MESSAGE };

      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getPhoneInfo(USER_ID).subscribe((response) => expect(response).toEqual(PHONE_METHOD_RESPONSE));

      const req = httpMock.expectOne(`${environment.baseUrl}${USER_PHONE_INFO_ENDPOINT(USER_ID)}`);
      expect(req.request.method).toEqual('GET');
      req.flush(PHONE_METHOD_RESPONSE);
    });

    it('should return null if endpoint GET phone info return error', () => {
      accessTokenService.storeAccessToken('ACCESS_TOKEN');
      service.getPhoneInfo(USER_ID).subscribe((response) => expect(response).toEqual(null));

      const req = httpMock.expectOne(`${environment.baseUrl}${USER_PHONE_INFO_ENDPOINT(USER_ID)}`);
      expect(req.request.method).toEqual('GET');
      req.error(new ErrorEvent('network error'));
    });
  });

  describe('edit', () => {
    it('should call endpoint, return user and set it', () => {
      const backendResponse = USER_DATA;
      let response: User;

      service.edit(USER_EDIT_DATA).subscribe((r) => (response = r));
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
        new_password: NEW_PASSWORD,
      };

      service.updatePassword(OLD_PASSWORD, NEW_PASSWORD).subscribe();
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_PASSWORD_ENDPOINT}`);
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

      service.getUnsubscribeReasons().subscribe((r) => (response = r));
      const req = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_UNSUBSCRIBE_REASONS);

      const languageParam = req.request.params.get(languageParamKey);
      expect(req.request.method).toBe('GET');
      expect(languageParam).toEqual(languageParamValue);
      expect(response).toEqual(MOCK_UNSUBSCRIBE_REASONS);
    });
  });

  describe('unsubscribe', () => {
    it('should call endpoint', () => {
      const expectedBody = {
        reason_id: SELECTED_REASON,
        other_reason: CUSTOM_REASON,
      };

      service.unsubscribe(SELECTED_REASON, CUSTOM_REASON).subscribe();
      const req = httpMock.expectOne(`${environment.baseUrl}${USER_UNSUBSCRIBE_ENDPOINT}`);
      req.flush({});

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBody);
    });
  });

  describe('isProfessional', () => {
    let val: boolean;

    beforeEach(() => {
      spyOn(permissionService, 'hasPermission').and.returnValue(Promise.resolve(true));

      service.isProfessional().subscribe((v) => {
        val = v;
      });
    });

    it('should call hasPermission', () => {
      expect(permissionService.hasPermission).toHaveBeenCalledWith(PERMISSIONS.professional);
    });

    it('should return true', () => {
      expect(val).toBe(true);
    });
  });

  describe('isProUser', () => {
    it('should return true if user is featured', (done) => {
      spyOn(service, 'getLoggedUserInformation').and.returnValue(of(MOCK_FULL_USER));

      service.initializeUser();
      let resp = service.isProUser();

      expect(resp).toBe(true);
      done();
    });

    it('should return false if user is not featured', (done) => {
      spyOn(service, 'getLoggedUserInformation').and.returnValue(of(MOCK_USER));

      service.initializeUser();
      let resp = service.isProUser();

      expect(resp).toBe(false);
      done();
    });
  });

  describe('suggest Pro', () => {
    describe('when is pro', () => {
      it('should not suggest pro', () => {
        jest.spyOn(service, 'isPro', 'get').mockReturnValue(true);

        const result = service.suggestPro();

        expect(result).toEqual(false);
      });
    });

    describe('when is not pro', () => {
      beforeEach(() => {
        jest.spyOn(service, 'isPro', 'get').mockReturnValue(false);
        jest.spyOn(service, 'user', 'get').mockReturnValue(MOCK_USER);
      });

      describe('and suggest was not cancel previously', () => {
        it('should suggest pro', () => {
          spyOn(localStorage, 'getItem').and.returnValue(null);

          const result = service.suggestPro();

          expect(localStorage.getItem).toHaveBeenCalledTimes(1);
          expect(localStorage.getItem).toHaveBeenCalledWith(`${MOCK_USER.id}-${LOCAL_STORAGE_TRY_PRO_SLOT}`);
          expect(result).toEqual(true);
        });
      });

      describe('and suggest was cancel previously', () => {
        it('should not suggest pro', () => {
          spyOn(localStorage, 'getItem').and.returnValue('true');

          const result = service.suggestPro();

          expect(localStorage.getItem).toHaveBeenCalledTimes(1);
          expect(localStorage.getItem).toHaveBeenCalledWith(`${MOCK_USER.id}-${LOCAL_STORAGE_TRY_PRO_SLOT}`);
          expect(result).toEqual(false);
        });
      });
    });
  });

  describe('Click PRO section', () => {
    beforeEach(() => {
      jest.spyOn(service, 'user', 'get').mockReturnValue(MOCK_USER);
    });
    describe('when user click pro section', () => {
      it('should save data', () => {
        spyOn(localStorage, 'setItem').and.callThrough();

        service.setClickedProSection();

        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith(`${MOCK_USER.id}-${LOCAL_STORAGE_CLICK_PRO_SECTION}`, 'true');
        expect(service.isClickedProSection).toEqual(true);
      });
      it('should return true', () => {
        service.setClickedProSection();

        expect(service.isClickedProSection).toEqual(true);
      });
    });

    describe('and has info saved ', () => {
      it('should return true', fakeAsync(() => {
        spyOn(localStorage, 'getItem').and.returnValue(true);
        spyOn(service, 'getLoggedUserInformation').and.returnValue(of(MOCK_USER));

        service.initializeUser();

        expect(localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem).toHaveBeenCalledWith(`${MOCK_USER.id}-${LOCAL_STORAGE_CLICK_PRO_SECTION}`);
        expect(service.isClickedProSection).toEqual(true);
      }));
    });

    describe('and has no info saved ', () => {
      it('should return true', fakeAsync(() => {
        spyOn(localStorage, 'getItem').and.returnValue(null);
        spyOn(service, 'getLoggedUserInformation').and.returnValue(of(MOCK_USER));

        service.initializeUser();

        expect(localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem).toHaveBeenCalledWith(`${MOCK_USER.id}-${LOCAL_STORAGE_CLICK_PRO_SECTION}`);
        expect(service.isClickedProSection).toEqual(false);
      }));
    });
  });

  describe('has store location', () => {
    describe('when user has not extra info', () => {
      it('should return false', () => {
        const response = service.hasStoreLocation(MOCK_USER);
        expect(response).toBe(false);
      });
    });

    describe('when user has not store address', () => {
      it('should return false', () => {
        const user: User = cloneDeep(MOCK_FULL_USER);
        user.extraInfo.address = '';
        const response = service.hasStoreLocation(user);
        expect(response).toBe(false);
      });
    });

    describe('when user has not lat and long set', () => {
      it('should return false', () => {
        const user: User = cloneDeep(MOCK_FULL_USER);
        user.extraInfo.address = 'test';
        user.extraInfo.latitude = 0;
        user.extraInfo.longitude = 0;
        const response = service.hasStoreLocation(user);
        expect(response).toBe(false);
      });
    });

    describe('when user has address and lat', () => {
      it('should return true', () => {
        const user: User = cloneDeep(MOCK_FULL_USER);
        user.extraInfo.address = 'test';
        user.extraInfo.latitude = 1.214;
        user.extraInfo.longitude = 0;
        const response = service.hasStoreLocation(user);
        expect(response).toBe(true);
      });
    });

    describe('when user has address and long', () => {
      it('should return true', () => {
        const user: User = cloneDeep(MOCK_FULL_USER);
        user.extraInfo.address = 'test';
        user.extraInfo.latitude = 0;
        user.extraInfo.longitude = 2.484;
        const response = service.hasStoreLocation(user);
        expect(response).toBe(true);
      });
    });
  });

  describe('Save local store', () => {
    beforeEach(() => {
      jest.spyOn(service, 'user', 'get').mockReturnValue(MOCK_USER);
    });
    it('should save data', () => {
      spyOn(localStorage, 'setItem').and.callThrough();

      service.saveLocalStore(LOCAL_STORAGE_CLICK_PRO_SECTION, 'true');

      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(`${MOCK_USER.id}-${LOCAL_STORAGE_CLICK_PRO_SECTION}`, 'true');
    });
  });

  describe('Get local store', () => {
    beforeEach(() => {
      jest.spyOn(service, 'user', 'get').mockReturnValue(MOCK_USER);
    });
    it('should retrieve data', () => {
      spyOn(localStorage, 'getItem').and.returnValue('true');

      const value = service.getLocalStore(LOCAL_STORAGE_CLICK_PRO_SECTION);

      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem).toHaveBeenCalledWith(`${MOCK_USER.id}-${LOCAL_STORAGE_CLICK_PRO_SECTION}`);
      expect(value).toEqual('true');
    });
  });
});
