import { TestBed } from '@angular/core/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import { CheckSessionService } from './check-session.service';

describe('CheckSessionService', () => {
  let checkSessionService: CheckSessionService;

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
      ],
    });

    checkSessionService = TestBed.inject(CheckSessionService);
  });

  it('should be created', () => {
    expect(checkSessionService).toBeTruthy();
  });

  describe('checkSessionAction', () => {
    it('should should redirect user if not logged', () => {
      spyOn(window.location, 'assign');

      checkSessionService.checkSessionAction();

      expect(window.location['assign']).toHaveBeenCalled();
    });
  });
});
