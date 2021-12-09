import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UserVerifications, VERIFICATION_METHOD } from '@api/core/model/verifications';
import {
  MOCK_USER_VERIFICATIONS_EMAIL_VERIFIED,
  MOCK_USER_VERIFICATIONS_MAPPED,
  MOCK_USER_VERIFICATIONS_PHONE_VERIFIED,
} from '@api/fixtures/user-verifications/user-verifications.fixtures.spec';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { UserService } from '@core/user/user.service';
import { MockedUserService, MOCK_FULL_USER } from '@fixtures/user.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailModalComponent } from '@shared/profile/edit-email/email-modal/email-modal.component';
import { Observable, of } from 'rxjs';
import { EmailVerificationModalComponent } from '../../modal/email-verification/modals/email-verification-modal/email-verification-modal.component';
import { PhoneVerificationModalComponent } from '../../modal/phone-verification/modals/phone-verification-modal/phone-verification-modal.component';
import { VerificationsNSecurityTrackingEventsService } from '../../services/verifications-n-security-tracking-events.service';
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
  let modalService: NgbModal;
  let verificationsNSecurityTrackingEventsService: VerificationsNSecurityTrackingEventsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerificationsNSecurityComponent, MockVerificationCardComponent],
      providers: [
        FormBuilder,
        { provide: UserService, useClass: MockedUserService },
        {
          provide: UserVerificationsService,
          useValue: {
            get userVerifications$() {
              return mockUserVerifications$;
            },
          },
        },
        {
          provide: VerificationsNSecurityTrackingEventsService,
          useValue: {
            verificationsNSecurityPageView() {},
            trackClickVerificationOptionEvent() {},
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    userService = TestBed.inject(UserService);
    modalService = TestBed.inject(NgbModal);
    userVerificationsService = TestBed.inject(UserVerificationsService);
    verificationsNSecurityTrackingEventsService = TestBed.inject(VerificationsNSecurityTrackingEventsService);
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

    it('should show the email and phone cards', () => {
      const cards: DebugElement[] = fixture.debugElement.queryAll(By.directive(MockVerificationCardComponent));

      expect(cards).toHaveLength(2);
    });

    it('should track page view event', () => {
      spyOn(verificationsNSecurityTrackingEventsService, 'verificationsNSecurityPageView');

      component.userVerifications$.subscribe((result) => {
        expect(verificationsNSecurityTrackingEventsService.verificationsNSecurityPageView).toHaveBeenCalledTimes(1);
        expect(verificationsNSecurityTrackingEventsService.verificationsNSecurityPageView).toHaveBeenCalledWith(result);
      });
    });
  });

  describe('Verification cards', () => {
    describe('when the verification service is loaded', () => {
      it('should show Email title', () => {
        const title = component.titleVerifications[VERIFICATIONS_N_SECURITY_TYPES.EMAIL];

        expect(title).toBe('Email');
      });

      it('should show Mobile phone title', () => {
        const title = component.titleVerifications[VERIFICATIONS_N_SECURITY_TYPES.PHONE];

        expect(title).toBe('Mobile phone');
      });

      describe('and the email is verified', () => {
        beforeEach(() => {
          spyUserVerificationsService = jest
            .spyOn(userVerificationsService, 'userVerifications$', 'get')
            .mockReturnValue(of(MOCK_USER_VERIFICATIONS_EMAIL_VERIFIED));
          fixture = TestBed.createComponent(VerificationsNSecurityComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
        it('should show Change button text', () => {
          let response: UserVerifications;

          component.userVerifications$.subscribe((userVerifications) => {
            response = userVerifications;
          });
          const text = component.verifiedTextButton[response.email.toString()];

          expect(text).toBe('Change');
        });
        it('should open the change email modal when button is clicked', () => {
          spyOn(modalService, 'open').and.callThrough();
          component.userVerifications$.subscribe((userVerifications) => {
            component.onClickVerifyEmail(userVerifications.email);

            expect(modalService.open).toHaveBeenCalledWith(EmailModalComponent, {
              windowClass: 'modal-standard',
            });
          });
        });
      });
      describe('and the email is not verified', () => {
        beforeEach(() => {
          spyOn(verificationsNSecurityTrackingEventsService, 'trackClickVerificationOptionEvent');
          fixture.detectChanges();
        });
        it('should show Verify button text', () => {
          let response: UserVerifications;
          component.userVerifications$.subscribe((userVerifications) => {
            response = userVerifications;
          });
          const text = component.verifiedTextButton[response.email.toString()];

          expect(text).toBe('Verify');
        });
        it('should open the email verification modal when button is clicked', () => {
          spyOn(modalService, 'open').and.callThrough();
          component.userVerifications$.subscribe((userVerifications) => {
            component.onClickVerifyEmail(userVerifications.email);

            expect(modalService.open).toHaveBeenCalledWith(EmailVerificationModalComponent, {
              windowClass: 'modal-standard',
            });

            expect(verificationsNSecurityTrackingEventsService.trackClickVerificationOptionEvent).toHaveBeenCalledTimes(1);
            expect(verificationsNSecurityTrackingEventsService.trackClickVerificationOptionEvent).toHaveBeenCalledWith(
              VERIFICATION_METHOD.EMAIL
            );
          });
        });
      });

      describe('and the phone is verified', () => {
        beforeEach(() => {
          spyOn(verificationsNSecurityTrackingEventsService, 'trackClickVerificationOptionEvent');
          spyUserVerificationsService = jest
            .spyOn(userVerificationsService, 'userVerifications$', 'get')
            .mockReturnValue(of(MOCK_USER_VERIFICATIONS_PHONE_VERIFIED));
          fixture = TestBed.createComponent(VerificationsNSecurityComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
        it('should show Change button text and the phone legend', () => {
          let response: UserVerifications;
          component.userVerifications$.subscribe((userVerifications) => {
            response = userVerifications;
          });
          const text = component.verifiedTextButton[response.phone.toString()];

          expect(text).toBe('Change');
          expect(component.userPhone).toBe('+34 935 50 09 96');
        });

        it('should open the phone verification modal when button is clicked', () => {
          spyOn(modalService, 'open').and.callThrough();
          component.onClickVerifyPhone();

          expect(modalService.open).toHaveBeenCalledWith(PhoneVerificationModalComponent, {
            windowClass: 'modal-standard',
          });
          expect(verificationsNSecurityTrackingEventsService.trackClickVerificationOptionEvent).toHaveBeenCalledTimes(1);
          expect(verificationsNSecurityTrackingEventsService.trackClickVerificationOptionEvent).toHaveBeenCalledWith(
            VERIFICATION_METHOD.PHONE
          );
        });
      });
      describe('and the phone is not verified', () => {
        beforeEach(() => {
          spyOn(verificationsNSecurityTrackingEventsService, 'trackClickVerificationOptionEvent');
          spyUserVerificationsService = jest
            .spyOn(userVerificationsService, 'userVerifications$', 'get')
            .mockReturnValue(of(MOCK_USER_VERIFICATIONS_EMAIL_VERIFIED));
          fixture = TestBed.createComponent(VerificationsNSecurityComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
        it('should show Verify button text and not show phone legend', () => {
          let response: UserVerifications;
          component.userVerifications$.subscribe((userVerifications) => {
            response = userVerifications;
          });
          const text = component.verifiedTextButton[response.phone.toString()];

          expect(text).toBe('Verify');
          expect(component.userPhone).toBe('');
        });

        it('should open the phone verification modal when button is clicked', () => {
          spyOn(modalService, 'open').and.callThrough();
          component.onClickVerifyPhone();

          expect(modalService.open).toHaveBeenCalledWith(PhoneVerificationModalComponent, {
            windowClass: 'modal-standard',
          });
          expect(verificationsNSecurityTrackingEventsService.trackClickVerificationOptionEvent).toHaveBeenCalledTimes(1);
          expect(verificationsNSecurityTrackingEventsService.trackClickVerificationOptionEvent).toHaveBeenCalledWith(
            VERIFICATION_METHOD.PHONE
          );
        });
      });
    });
  });
});
