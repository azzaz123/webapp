import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import { EventService } from '@core/event/event.service';
import { environment } from '@environments/environment';
import { LoginService, LOGIN_ENDPOINT } from './login.service';
import { MOCK_USER_RESPONSE_BODY } from '@fixtures/user.fixtures.spec';
import { CookieModule } from 'ngx-cookie';
import { DeviceService } from '@core/device/device.service';
import { MockDeviceService } from '@fixtures/device.fixtures.spec';
import { LoginRequest } from '../interfaces/login.request';

describe('LoginService', () => {
  let injector: TestBed;
  let service: LoginService;
  let accessTokenService: AccessTokenService;
  let httpMock: HttpTestingController;
  let eventService: EventService;
  let deviceService: DeviceService;

  const MOCK_DEVICE_ID = 'lel123';

  beforeEach(() => {
    injector = getTestBed();
    injector.configureTestingModule({
      imports: [HttpClientTestingModule, CookieModule],
      providers: [
        LoginService,
        {
          provide: AccessTokenService,
          useValue: {
            storeAccessToken: () => {},
          },
        },
        EventService,
        { provide: DeviceService, useValue: MockDeviceService },
      ],
    });

    service = injector.inject(LoginService);
    accessTokenService = injector.inject(AccessTokenService);
    eventService = injector.inject(EventService);
    deviceService = injector.inject(DeviceService);
    httpMock = injector.inject(HttpTestingController);

    spyOn(deviceService, 'getDeviceId').and.returnValue(MOCK_DEVICE_ID);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  const MOCK_LOGIN_REQUEST: LoginRequest = {
    emailAddress: 'test@test.it',
    password: 'test',
  };

  describe('when requesting login', () => {
    describe('and when request is successful', () => {
      it('should ask server for response', () => {
        const expectedBody: LoginRequest = {
          ...MOCK_LOGIN_REQUEST,
          metadata: {
            installationId: MOCK_DEVICE_ID,
            installationType: 'WEB',
            pushToken: '',
          },
        };

        service.login(MOCK_LOGIN_REQUEST).subscribe();
        const req = httpMock.expectOne(`${environment.baseUrl}${LOGIN_ENDPOINT}`);
        req.flush(MOCK_USER_RESPONSE_BODY);

        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(expectedBody);
      });

      it('should emit login event', () => {
        spyOn(eventService, 'emit').and.callThrough();

        service.login(MOCK_LOGIN_REQUEST).subscribe();
        const req = httpMock.expectOne(`${environment.baseUrl}${LOGIN_ENDPOINT}`);
        req.flush(MOCK_USER_RESPONSE_BODY);

        expect(eventService.emit).toHaveBeenCalledWith(EventService.USER_LOGIN, MOCK_USER_RESPONSE_BODY.token);
      });

      it('should store access token', () => {
        spyOn(accessTokenService, 'storeAccessToken');

        service.login(MOCK_LOGIN_REQUEST).subscribe();
        const req = httpMock.expectOne(`${environment.baseUrl}${LOGIN_ENDPOINT}`);
        req.flush(MOCK_USER_RESPONSE_BODY);

        expect(accessTokenService.storeAccessToken).toHaveBeenCalledWith(MOCK_USER_RESPONSE_BODY.token);
      });
    });
  });
});
