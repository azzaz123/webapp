import { TestBed, async, inject } from '@angular/core/testing';

import { TutorialGuard } from './tutorial.guard';
import { TutorialService } from '../../core/tutorial/tutorial.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

describe('TutorialGuard', () => {

  let guard: TutorialGuard;
  let router: Router;
  let tutorialService: TutorialService;

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
        }
      ]
    });
    guard = TestBed.get(TutorialGuard);
    router = TestBed.get(Router);
    tutorialService = TestBed.get(TutorialService);
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
      expect(displayed).toBeFalsy();
    });

    it('should not redirect if tutorial has already displayed', () => {
      spyOn(tutorialService, 'isAlreadyDisplayed').and.returnValue(Observable.of(true));

      (<Observable<boolean>>guard.canActivate()).subscribe((val: boolean) => {
        displayed = val;
      });

      expect(router.navigate).not.toHaveBeenCalled();
      expect(displayed).toBeTruthy();
    });
  });
});
