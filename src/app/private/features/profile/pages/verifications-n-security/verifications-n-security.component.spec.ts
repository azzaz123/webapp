import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { VERIFICATION_METHOD } from '@api/core/model/verifications';
import {
  MOCK_USER_VERIFICATIONS_EMAIL_VERIFIED,
  MOCK_USER_VERIFICATIONS_MAPPED,
  MOCK_USER_VERIFICATIONS_PHONE_VERIFIED,
} from '@api/fixtures/user-verifications/user-verifications.fixtures.spec';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { UserService } from '@core/user/user.service';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailModalComponent } from '@shared/profile/edit-email/email-modal/email-modal.component';
import { combineLatest, of } from 'rxjs';
import { EmailVerificationModalComponent } from '../../modal/email-verification/modals/email-verification-modal/email-verification-modal.component';
import { PhoneVerificationModalComponent } from '../../modal/phone-verification/modals/phone-verification-modal/phone-verification-modal.component';
import { VerificationsNSecurityTrackingEventsService } from '../../services/verifications-n-security-tracking-events.service';
import { VERIFICATIONS_N_SECURITY_STATUS } from './interfaces/verifications-n-security-status.enum';
import { VERIFICATIONS_N_SECURITY_TYPES } from './interfaces/verifications-n-security-types.enum';
import { VerificationsNSecurityStore } from './services/verifications-n-security-store.service';
import { VerificationsNSecurityComponent } from './verifications-n-security.component';

@Component({
  selector: 'tsl-verification-card',
  template: '',
})
class MockVerificationCardComponent {}

describe('VerificationsNSecurityComponent', () => {
  let component: VerificationsNSecurityComponent;
  let fixture: ComponentFixture<VerificationsNSecurityComponent>;
  let verificationsNSecurityStore: VerificationsNSecurityStore;
  let spyVerificationsNSecurityStore;
  let modalService: NgbModal;
  let verificationsNSecurityTrackingEventsService: VerificationsNSecurityTrackingEventsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerificationsNSecurityComponent, MockVerificationCardComponent],
      imports: [HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: UserService, useClass: MockedUserService },
        {
          provide: UserVerificationsService,
          useValue: {
            verifyPhone() {
              return of({});
            },
            verifyEmail() {
              return of({});
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
        {
          provide: VerificationsNSecurityStore,
          useValue: {
            get userVerifications$() {
              return of();
            },
            get userInformation$() {
              return of();
            },
            initializeUserVerifications() {},
          },
        },
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                componentInstance: {},
              };
            },
          },
        },
        { provide: FeatureFlagService, useClass: FeatureFlagServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    modalService = TestBed.inject(NgbModal);
    verificationsNSecurityStore = TestBed.inject(VerificationsNSecurityStore);
    verificationsNSecurityTrackingEventsService = TestBed.inject(VerificationsNSecurityTrackingEventsService);
  });

  beforeEach(() => {
    spyVerificationsNSecurityStore = jest
      .spyOn(verificationsNSecurityStore, 'userVerifications$', 'get')
      .mockReturnValue(of(MOCK_USER_VERIFICATIONS_MAPPED));

    fixture = TestBed.createComponent(VerificationsNSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  describe('when the verifications view is loaded', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should show the email and phone cards', fakeAsync((done) => {
      combineLatest([
        component.verificationsNSecurityStore.userVerifications$,
        component.verificationsNSecurityStore.userInformation$,
      ]).subscribe(() => {
        const cards: DebugElement[] = fixture.debugElement.queryAll(By.directive(MockVerificationCardComponent));

        expect(cards).toHaveLength(2);
        done();
      });
    }));

    it('should track page view event', fakeAsync((done) => {
      spyOn(verificationsNSecurityTrackingEventsService, 'verificationsNSecurityPageView');
      combineLatest([
        component.verificationsNSecurityStore.userVerifications$,
        component.verificationsNSecurityStore.userInformation$,
      ]).subscribe(([userVerifications, userInformation]) => {
        expect(verificationsNSecurityTrackingEventsService.verificationsNSecurityPageView).toHaveBeenCalledTimes(1);
        expect(verificationsNSecurityTrackingEventsService.verificationsNSecurityPageView).toHaveBeenCalledWith(userVerifications);
        done();
      });
    }));
  });

  describe('Verification cards', () => {
    beforeEach(() => {
      jest
        .spyOn(verificationsNSecurityStore, 'userInformation$', 'get')
        .mockReturnValue(of({ email: 'test@test.com', phone: '+4444444444' }));
    });
    describe('when the verification service is loaded', () => {
      it('should show Email title', () => {
        const title = component.titleVerificationsNSecurity[VERIFICATIONS_N_SECURITY_TYPES.EMAIL];

        expect(title).toBe('Email');
      });

      it('should show Mobile phone title', () => {
        const title = component.titleVerificationsNSecurity[VERIFICATIONS_N_SECURITY_TYPES.PHONE];

        expect(title).toBe('Mobile phone');
      });

      it('should show Password title', () => {
        const title = component.titleVerificationsNSecurity[VERIFICATIONS_N_SECURITY_TYPES.PASSWORD];

        expect(title).toBe('Password');
      });

      describe('and the email is verified', () => {
        beforeEach(() => {
          spyVerificationsNSecurityStore.mockReturnValue(of(MOCK_USER_VERIFICATIONS_EMAIL_VERIFIED));
          fixture = TestBed.createComponent(VerificationsNSecurityComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });

        it('should has VERIFIED status', () => {
          expect(component.userVerificationsStatus[VERIFICATIONS_N_SECURITY_TYPES.EMAIL]).toBe(VERIFICATIONS_N_SECURITY_STATUS.VERIFIED);
        });

        it('should open the change email modal when button is clicked', (done) => {
          spyOn(modalService, 'open').and.callThrough();

          component.verificationsNSecurityStore.userVerifications$.subscribe((userVerifications) => {
            component.onClickVerifyEmail(userVerifications.email);

            expect(modalService.open).toHaveBeenCalledWith(EmailModalComponent, {
              windowClass: 'modal-standard',
            });
            done();
          });
        });
      });

      describe('and the email is not verified', () => {
        beforeEach(() => {
          spyOn(verificationsNSecurityTrackingEventsService, 'trackClickVerificationOptionEvent');

          spyVerificationsNSecurityStore = jest
            .spyOn(verificationsNSecurityStore, 'userInformation$', 'get')
            .mockReturnValue(of({ email: 'test@test.com', phone: '' }));
        });
        it('should has NOT VERIFIED status', () => {
          component.ngOnInit();
          expect(component.userVerificationsStatus[VERIFICATIONS_N_SECURITY_TYPES.EMAIL]).toBe(
            VERIFICATIONS_N_SECURITY_STATUS.NOT_VERIFIED
          );
        });
        it('should open the email verification modal when button is clicked', (done) => {
          spyOn(modalService, 'open').and.callThrough();
          component.ngOnInit();
          component.verificationsNSecurityStore.userVerifications$.subscribe((userVerifications) => {
            component.onClickVerifyEmail(userVerifications.email);

            expect(modalService.open).toHaveBeenCalledWith(EmailVerificationModalComponent, {
              windowClass: 'modal-standard',
            });

            expect(verificationsNSecurityTrackingEventsService.trackClickVerificationOptionEvent).toHaveBeenCalledTimes(1);
            expect(verificationsNSecurityTrackingEventsService.trackClickVerificationOptionEvent).toHaveBeenCalledWith(
              VERIFICATION_METHOD.EMAIL
            );
            done();
          });
        });
      });

      describe('and the phone is verified', () => {
        beforeEach(() => {
          spyOn(verificationsNSecurityTrackingEventsService, 'trackClickVerificationOptionEvent');
          jest.spyOn(verificationsNSecurityStore, 'userVerifications$', 'get').mockReturnValue(of(MOCK_USER_VERIFICATIONS_PHONE_VERIFIED));

          fixture = TestBed.createComponent(VerificationsNSecurityComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });

        it('should has VERIFIED status', () => {
          expect(component.userVerificationsStatus[VERIFICATIONS_N_SECURITY_TYPES.PHONE]).toBe(VERIFICATIONS_N_SECURITY_STATUS.VERIFIED);
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
          jest.spyOn(verificationsNSecurityStore, 'userVerifications$', 'get').mockReturnValue(of(MOCK_USER_VERIFICATIONS_EMAIL_VERIFIED));
          fixture = TestBed.createComponent(VerificationsNSecurityComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
        it('should has NOT VERIFIED status', () => {
          expect(component.userVerificationsStatus[VERIFICATIONS_N_SECURITY_TYPES.PHONE]).toBe(
            VERIFICATIONS_N_SECURITY_STATUS.NOT_VERIFIED
          );
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
