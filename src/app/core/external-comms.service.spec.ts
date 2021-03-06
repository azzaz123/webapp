import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { ExternalCommsService } from './external-comms.service';
import { UserService } from '@core/user/user.service';
import { MockUserService } from '@fixtures/user.fixtures.spec';
import { NotificationApiService } from '@api/notification/notification-api.service';
import { of } from 'rxjs';

describe('ExternalCommsService', () => {
  let service: ExternalCommsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: MockUserService },
        {
          provide: NotificationApiService,
          useValue: {
            totalUnreadNotifications$: of(0),
            getNotifications: () => {},
            refreshUnreadNotifications: () => {},
          },
        },
      ],
    });
    service = TestBed.inject(ExternalCommsService);
  });

  describe('when initializing Braze communications', () => {
    it('should initialize Braze configuration', fakeAsync(() => {
      const MOCK_BRAZE_CONFIG = { manageServiceWorkerExternally: true };
      spyOn(appboy, 'initialize');

      service.initializeBraze();
      tick();

      expect(appboy.initialize).toHaveBeenCalledWith(environment.appboy, MOCK_BRAZE_CONFIG);
    }));

    it('should emit an event when the Braze library is ready to be used', fakeAsync(() => {
      let brazeReadyEventSent = false;
      service.brazeReady$.subscribe(() => {
        brazeReadyEventSent = true;
      });

      service.initializeBraze();
      tick();

      expect(brazeReadyEventSent).toBe(true);
    }));
  });
});
