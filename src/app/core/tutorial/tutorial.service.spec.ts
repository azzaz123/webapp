import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MOCK_USER, USER_ID } from '../../../tests/user.fixtures.spec';
import { UserService } from '../user/user.service';
import { TutorialService } from './tutorial.service';

describe('TutorialService', () => {
  let service: TutorialService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TutorialService,
        {
          provide: UserService,
          useValue: {
            user: MOCK_USER,
            isProfessional() {
              return of(true);
            },
          },
        },
      ],
    });
    service = TestBed.inject(TutorialService);
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
      service.nextStep();

      service.prevStep();

      expect(service.step).toBe(1);
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

      expect(localStorage.setItem).toHaveBeenCalledWith(USER_ID + '-tutorial', 'true');
    });
  });

  describe('isAlreadyDisplayed', () => {
    it('should return true if local storage is set', () => {
      spyOn(localStorage, 'getItem').and.returnValue('true');
      let displayed: boolean;

      displayed = service.isAlreadyDisplayed();

      expect(localStorage.getItem).toHaveBeenCalledWith(USER_ID + '-tutorial');
      expect(displayed).toBeTruthy();
    });

    it('should return false if local storage is NOT set', () => {
      spyOn(localStorage, 'getItem').and.returnValue(undefined);
      let displayed: boolean;

      displayed = service.isAlreadyDisplayed();

      expect(localStorage.getItem).toHaveBeenCalledWith(USER_ID + '-tutorial');
      expect(displayed).toBeFalsy();
    });
  });
});
