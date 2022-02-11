import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { ExternalCommsService } from './external-comms.service';

describe('ExternalCommsService', () => {
  let service: ExternalCommsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalCommsService);
  });

  describe('when initializing Braze communications', () => {
    it('should initialize Braze configuration', fakeAsync(() => {
      const MOCK_BRAZE_CONFIG = { enableHtmlInAppMessages: true };
      spyOn(appboy, 'initialize');

      service.initializeBraze();
      tick();

      expect(appboy.initialize).toHaveBeenCalledWith(environment.appboy, MOCK_BRAZE_CONFIG);
    }));

    it('should enable displaying automatically Braze in-app messages', fakeAsync(() => {
      spyOn(appboy.display, 'automaticallyShowNewInAppMessages');

      service.initializeBraze();
      tick();

      expect(appboy.display.automaticallyShowNewInAppMessages).toHaveBeenCalledTimes(1);
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
