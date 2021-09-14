import { TestBed } from '@angular/core/testing';
import { SITE_URL } from '@configs/site-url.config';
import { AccessTokenService } from '@core/http/access-token.service';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { CheckSessionService } from './check-session.service';

describe('CheckSessionService', () => {
  let checkSessionService: CheckSessionService;
  let accessTokenService: AccessTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CheckSessionService,
        {
          provide: AccessTokenService,
          useValue: {
            accessToken: undefined,
          },
        },
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
      ],
    });

    checkSessionService = TestBed.inject(CheckSessionService);
    accessTokenService = TestBed.inject(AccessTokenService);
  });

  it('should be created', () => {
    expect(checkSessionService).toBeTruthy();
  });

  describe('hasSession', () => {
    it('should return boolean with access token definition', () => {
      expect(checkSessionService.hasSession()).toEqual(accessTokenService.accessToken !== undefined);
    });
  });

  describe('checkSessionAction', () => {
    it('should should redirect user if not logged', () => {
      spyOn(window.location, 'assign');

      checkSessionService.checkSessionAction();

      expect(window.location['assign']).toHaveBeenCalled();
    });
  });
});
