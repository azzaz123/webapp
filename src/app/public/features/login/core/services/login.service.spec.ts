import { getTestBed, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import { EventService } from '@core/event/event.service';
import { environment } from '@environments/environment';
import { LoginResponse } from './../login-response.interface';
import { HttpParams } from '@angular/common/http';
import { LoginService, LOGIN_ENDPOINT } from './login.service';
import { MOCK_USER_RESPONSE_BODY } from '@fixtures/user.fixtures.spec';
import { CookieModule, CookieService } from 'ngx-cookie';

describe('LoginService', () => {
  let injector: TestBed;
  let service: LoginService;
  let accessTokenService: AccessTokenService;
  let httpMock: HttpTestingController;
  let eventService: EventService;

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
      ],
    });

    service = injector.inject(LoginService);
    accessTokenService = injector.inject(AccessTokenService);
    eventService = injector.inject(EventService);
    httpMock = injector.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  const MOCK_LOGIN_INPUT = {
    emailAddress: 'test@test.it',
    installationType: 'ANDROID',
    password: 'test',
  };

  describe('when requesting login', () => {
    describe('and when request is successful', () => {
      it('should ask server for response', () => {
        const expectedBody = new HttpParams()
          .set('emailAddress', MOCK_LOGIN_INPUT.emailAddress)
          .set('installationType', MOCK_LOGIN_INPUT.installationType)
          .set('password', MOCK_LOGIN_INPUT.password)
          .toString();

        service.login(MOCK_LOGIN_INPUT).subscribe();
        const req = httpMock.expectOne(
          `${environment.baseUrl}${LOGIN_ENDPOINT}`
        );
        req.flush(MOCK_USER_RESPONSE_BODY);

        expect(req.request.method).toBe('POST');
        expect(req.request.body.toString()).toEqual(expectedBody);
      });

      it('should emit login event', () => {
        spyOn(eventService, 'emit').and.callThrough();

        service.login(MOCK_LOGIN_INPUT).subscribe();
        const req = httpMock.expectOne(
          `${environment.baseUrl}${LOGIN_ENDPOINT}`
        );
        req.flush(MOCK_USER_RESPONSE_BODY);

        expect(eventService.emit).toHaveBeenCalledWith(
          EventService.USER_LOGIN,
          MOCK_USER_RESPONSE_BODY.token
        );
      });

      it('should store access token', () => {
        spyOn(accessTokenService, 'storeAccessToken');

        service.login(MOCK_LOGIN_INPUT).subscribe();
        const req = httpMock.expectOne(
          `${environment.baseUrl}${LOGIN_ENDPOINT}`
        );
        req.flush(MOCK_USER_RESPONSE_BODY);

        expect(accessTokenService.storeAccessToken).toHaveBeenCalledWith(
          MOCK_USER_RESPONSE_BODY.token
        );
      });
    });
  });
});
