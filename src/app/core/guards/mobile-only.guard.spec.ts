import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DeviceService } from '@core/device/device.service';

import { MobileOnlyGuard } from './mobile-only.guard';

describe('MobileOnlyGuard', () => {
  let guard: MobileOnlyGuard;
  let deviceService: DeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MobileOnlyGuard,
        {
          provide: Router,
          useValue: {
            navigate: () => {},
          },
        },
        {
          provide: DeviceService,
          useValue: {
            isMobile: () => false,
          },
        },
      ],
    });

    deviceService = TestBed.inject(DeviceService);
    guard = TestBed.inject(MobileOnlyGuard);
  });

  describe('when the device is not a mobile', () => {
    it('should not allow access to the route', () => {
      const canLoad = guard.canLoad();

      expect(canLoad).toBe(false);
    });
  });

  describe('when the device is a mobile', () => {
    it('should allow access to the route', () => {
      spyOn(deviceService, 'isMobile').and.returnValue(true);

      const canLoad = guard.canLoad();

      expect(canLoad).toBe(true);
    });
  });
});
