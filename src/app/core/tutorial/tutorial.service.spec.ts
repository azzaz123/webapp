import { TestBed, inject } from '@angular/core/testing';

import { TutorialService } from './tutorial.service';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs/Observable';
import { MOCK_USER, USER_ID } from 'shield';

describe('TutorialService', () => {

  let service: TutorialService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TutorialService,
        {
          provide: UserService, useValue: {
          user: MOCK_USER,
          me() {
            return Observable.of(MOCK_USER);
          }
        }
        }
      ]
    });
    service = TestBed.get(TutorialService);
  });

  describe('nextStep', () => {
    it('should increment step', () => {
      service.nextStep();

      expect(service.step).toBe(1);
    });
  });

  describe('nextStep', () => {
    it('should reset step', () => {
      service.nextStep();

      service.resetStep();

      expect(service.step).toBe(0);
    });
  });

  describe('setDisplayed', () => {
    it('should set local storage', () => {
      spyOn(localStorage, 'setItem');

      service.setDisplayed();

      expect(localStorage.setItem).toHaveBeenCalledWith(USER_ID + '-tutorial', 'true');
    });
  });

  describe('isAlreadyDisplayed', () => {
    it('should return true il local storage is set', () => {
      spyOn(localStorage, 'getItem').and.returnValue('true');
      let displayed: boolean;

      service.isAlreadyDisplayed().subscribe((val: boolean) => {
        displayed = val;
      });

      expect(localStorage.getItem).toHaveBeenCalledWith(USER_ID + '-tutorial');
      expect(displayed).toBeTruthy();
    });

    it('should return false il local storage is NOT set', () => {
      spyOn(localStorage, 'getItem').and.returnValue(undefined);
      let displayed: boolean;

      service.isAlreadyDisplayed().subscribe((val: boolean) => {
        displayed = val;
      });

      expect(localStorage.getItem).toHaveBeenCalledWith(USER_ID + '-tutorial');
      expect(displayed).toBeFalsy();
    });
  });
});
