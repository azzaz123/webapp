import { SessionService } from '@core/session/session.service';
import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie';

jest.useFakeTimers();

describe('SessionService', () => {
  let cookieService: CookieService;
  let cookies: object;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CookieService,
          useValue: {
            get: (name): string => {
              return cookies[name]?.value;
            },
            put: (name, value, options): void => {
              cookies[name] = {
                value,
                options,
              };
            },
          },
        },
        SessionService,
      ],
    });

    cookies = {};
    cookieService = TestBed.inject(CookieService);
    spyOn(cookieService, 'put').and.callThrough();
  });

  describe('onNewSession', () => {
    describe('when no session cookie is present', () => {
      it('should execute session callbacks and start session', () => {
        const service = TestBed.inject(SessionService);
        const callback = jest.fn();

        service.onNewSession(callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expectInitSession();
      });
    });

    describe('when cookie session is present', () => {
      beforeEach(() => {
        cookies = {
          wallapop_keep_session: {
            value: 'true',
          },
        };
      });
      it('should not execute session callbacks and keep session', () => {
        const service = TestBed.inject(SessionService);
        const callback = jest.fn();

        service.onNewSession(callback);

        expect(callback).toHaveBeenCalledTimes(0);
        expectInitSession();
      });
    });
  });

  function expectInitSession(): void {
    expect(cookieService.put).toHaveBeenCalledTimes(1);
    expectSessionCookie();

    const advanceTime = 4 * 60000;
    jest.advanceTimersByTime(advanceTime);
    expect(cookieService.put).toHaveBeenCalledTimes(5);
    expectSessionCookie();

    window.dispatchEvent(new Event('unload'));
    expect(cookieService.put).toHaveBeenCalledTimes(6);
    expectSessionCookie();
  }

  function expectSessionCookie(): void {
    expect(cookies).toEqual({
      wallapop_keep_session: {
        value: 'true',
        options: {
          domain: 'localhost',
          path: '/',
          expires: expect.any(Date),
        },
      },
    });

    let expiryDate: Date = cookies['wallapop_keep_session'].options.expires;
    expect(expiryDate.getTime()).toBeGreaterThanOrEqual(
      new Date(new Date().getTime() + 15 * 60000 - 1000).getTime()
    );
    expect(expiryDate.getTime()).toBeLessThanOrEqual(
      new Date(new Date().getTime() + 15 * 60000 + 1000).getTime()
    );
  }
});
