import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UserVerifications } from '@api/core/model/verifications';
import {
  MOCK_USER_VERIFICATIONS_EMAIL_VERIFIED,
  MOCK_USER_VERIFICATIONS_MAPPED,
} from '@api/fixtures/user-verifications/user-verifications.fixtures.spec';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { UserService } from '@core/user/user.service';
import { MockedUserService, MOCK_FULL_USER } from '@fixtures/user.fixtures.spec';
import { Observable, of } from 'rxjs';

import { VerificationsNSecurityComponent, VERIFICATIONS_N_SECURITY_TYPES } from './verifications-n-security.component';

@Component({
  selector: 'tsl-verification-card',
  template: '',
})
class MockVerificationCardComponent {}

describe('VerificationsNSecurityComponent', () => {
  let component: VerificationsNSecurityComponent;
  let fixture: ComponentFixture<VerificationsNSecurityComponent>;
  let mockUserVerifications$: Observable<UserVerifications> = of(MOCK_USER_VERIFICATIONS_MAPPED);
  let userService: UserService;
  let userVerificationsService: UserVerificationsService;
  let spyUserVerificationsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerificationsNSecurityComponent, MockVerificationCardComponent],
      providers: [
        { provide: UserService, useClass: MockedUserService },
        {
          provide: UserVerificationsService,
          useValue: {
            get userVerifications$() {
              return mockUserVerifications$;
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    userService = TestBed.inject(UserService);
    userVerificationsService = TestBed.inject(UserVerificationsService);
  });

  beforeEach(() => {
    jest.spyOn(userService, 'user', 'get').mockReturnValue(MOCK_FULL_USER);
    spyUserVerificationsService = jest.spyOn(userVerificationsService, 'userVerifications$', 'get');
    fixture = TestBed.createComponent(VerificationsNSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  describe('when the verifications view is loaded', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should call to the user verifications service', () => {
      expect(spyUserVerificationsService).toHaveBeenCalledTimes(1);
    });

    it('should retrieve the user verifications', () => {
      component.userVerifications$.subscribe((result) => {
        expect(result).toEqual(MOCK_USER_VERIFICATIONS_MAPPED);
      });
    });

    it('should show the email card', () => {
      const card = fixture.debugElement.queryAll(By.directive(MockVerificationCardComponent));

      expect(card).toBeTruthy();
    });
  });

  describe('verifications text', () => {
    describe('when the verifications service is loaded', () => {
      it('should show E-mail title', () => {
        const title = component.titleVerifications[VERIFICATIONS_N_SECURITY_TYPES.EMAIL];

        expect(title).toBe($localize`:@@verification_and_security_all_users_verifications_email_label:E-mail`);
      });
      describe('and the email is verified', () => {
        beforeEach(() => {
          spyUserVerificationsService = jest
            .spyOn(userVerificationsService, 'userVerifications$', 'get')
            .mockReturnValue(of(MOCK_USER_VERIFICATIONS_EMAIL_VERIFIED));
          fixture.detectChanges();
        });
        it('should show Change button text', () => {
          component.userVerifications$.subscribe((userVerifications) => {
            const text = component.verifiedTextButton[userVerifications.email.toString()];

            expect(text).toBe($localize`:@@verification_and_security_all_users_change_button:Change`);
          });
        });
      });
      describe('and the email is not verified', () => {
        it('should show Verify button text', () => {
          component.userVerifications$.subscribe((userVerifications) => {
            const text = component.verifiedTextButton[userVerifications.email.toString()];

            expect(text).toBe($localize`:@@verification_and_security_all_users_verify_button:Verify`);
          });
        });
      });
    });
  });
});
