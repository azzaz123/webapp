import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { MOCK_USER, USER_ID } from 'shield';
import { BumpTutorialService } from './bump-tutorial.service';
import { UserService } from '../../../core/user/user.service';

describe('BumpTutorialService', () => {

  let service: BumpTutorialService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BumpTutorialService,
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
    service = TestBed.get(BumpTutorialService);
  });

  describe('nextStep', () => {
    it('should increment step', () => {
      service.nextStep();

      expect(service.step).toBe(1);
    });
  });

  describe('prevStep', () => {
    it('should decrement step', () => {
      service.nextStep();
      service.prevStep();

      expect(service.step).toBe(0);
    });
  });

  describe('resetStep', () => {
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

      expect(localStorage.setItem).toHaveBeenCalledWith(USER_ID + '-bump', 'true');
    });
  });

  describe('isAlreadyDisplayed', () => {
    it('should return true if local storage is set', () => {
      spyOn(localStorage, 'getItem').and.returnValue('true');
      let displayed: boolean;

      service.isAlreadyDisplayed().subscribe((val: boolean) => {
        displayed = val;
      });

      expect(localStorage.getItem).toHaveBeenCalledWith(USER_ID + '-bump');
      expect(displayed).toBeTruthy();
    });

    it('should return false if local storage is NOT set', () => {
      spyOn(localStorage, 'getItem').and.returnValue(undefined);
      let displayed: boolean;

      service.isAlreadyDisplayed().subscribe((val: boolean) => {
        displayed = val;
      });

      expect(localStorage.getItem).toHaveBeenCalledWith(USER_ID + '-bump');
      expect(displayed).toBeFalsy();
    });
  });
});
