import { TestBed, async, inject } from '@angular/core/testing';

import { TutorialGuard } from './tutorial.guard';
import { TutorialService } from '../../core/tutorial/tutorial.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DeviceDetectorServiceMock } from '../../../tests';

describe('TutorialGuard', () => {

  let guard: TutorialGuard;
  let router: Router;
  let tutorialService: TutorialService;
  let deviceService: DeviceDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TutorialGuard,
        {
          provide: TutorialService, useValue: {
          isAlreadyDisplayed() {
            return Observable.of(false);
          }
        }
        },
        {
          provide: Router, useValue: {
          navigate() {
          }
        }
        },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
      ]
    });
    guard = TestBed.get(TutorialGuard);
    router = TestBed.get(Router);
    tutorialService = TestBed.get(TutorialService);
    deviceService = TestBed.get(DeviceDetectorService);
  });

  describe('canActivate', () => {

    let displayed: boolean;

    beforeEach(() => {
      spyOn(router, 'navigate');
      displayed = undefined;
    });

    it('should redirect if tutorial has not already displayed', () => {
      (<Observable<boolean>>guard.canActivate()).subscribe((val: boolean) => {
        displayed = val;
      });

      expect(router.navigate).toHaveBeenCalledWith(['tutorial']);
      expect(displayed).toBe(false);
    });

    it('should not redirect if tutorial has already displayed', () => {
      spyOn(tutorialService, 'isAlreadyDisplayed').and.returnValue(Observable.of(true));

      (<Observable<boolean>>guard.canActivate()).subscribe((val: boolean) => {
        displayed = val;
      });

      expect(router.navigate).not.toHaveBeenCalled();
      expect(displayed).toBe(true);
    });

    it('should not redirect if is a mobile device', () => {
      spyOn(deviceService, 'isMobile').and.returnValue(true);

      (<Observable<boolean>>guard.canActivate()).subscribe((val: boolean) => {
        displayed = val;
      });

      expect(router.navigate).not.toHaveBeenCalled();
      expect(displayed).toBe(true);
    });
  });
});
