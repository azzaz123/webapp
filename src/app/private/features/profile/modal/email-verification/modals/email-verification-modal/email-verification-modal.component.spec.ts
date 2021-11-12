import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VerificationsNSecurityTrackingEventsService } from '@private/features/profile/services/verifications-n-security-tracking-events.service';
import { EmailModalComponent } from '@shared/profile/edit-email/email-modal/email-modal.component';
import { of } from 'rxjs';
import { EmailThanksModalComponent } from '../../../email-thanks-modal/email-thanks-modal.component';
import { EmailVerificationModalComponent } from './email-verification-modal.component';

@Component({
  selector: 'tsl-svg-icon',
  template: '',
})
class MockSvgIconComponent {}

describe('EmailVerificationModalComponent', () => {
  let component: EmailVerificationModalComponent;
  let fixture: ComponentFixture<EmailVerificationModalComponent>;
  let activeModal: NgbActiveModal;
  let modalService: NgbModal;
  let verificationsNSecurityTrackingEventsService: VerificationsNSecurityTrackingEventsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [EmailVerificationModalComponent, MockSvgIconComponent],
      providers: [
        NgbActiveModal,
        {
          provide: UserVerificationsService,
          useValue: {
            verifyEmail() {
              return of({});
            },
          },
        },
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: {},
              };
            },
          },
        },
        {
          provide: VerificationsNSecurityTrackingEventsService,
          useValue: {
            trackStartEmailVerificationProcessEvent() {},
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    modalService = TestBed.inject(NgbModal);
    activeModal = TestBed.inject(NgbActiveModal);
    verificationsNSecurityTrackingEventsService = TestBed.inject(VerificationsNSecurityTrackingEventsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVerificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(activeModal, 'close').and.callThrough();
    spyOn(activeModal, 'dismiss').and.callThrough();
  });

  describe('when close button is clicked', () => {
    it('should dismiss the modal', () => {
      const closeButton: HTMLElement = fixture.debugElement.query(By.css('.EmailVerificationModal__close')).nativeElement;

      closeButton.click();

      expect(activeModal.dismiss).toHaveBeenCalled();
    });
  });

  describe('Change Email Button', () => {
    describe('when change email button is clicked', () => {
      it('should close the current modal and open the change email modal', () => {
        spyOn(modalService, 'open').and.callThrough();
        const changeButton: HTMLElement = fixture.debugElement.query(By.css('.EmailVerificationModal__change-btn')).nativeElement;
        changeButton.click();

        expect(activeModal.close).toHaveBeenCalledTimes(1);
        expect(activeModal.close).toHaveBeenCalled();
        expect(modalService.open).toHaveBeenCalledWith(EmailModalComponent, {
          windowClass: 'modal-standard',
        });
      });
    });
  });

  describe('Verify Button', () => {
    describe('when verify button is clicked', () => {
      beforeEach(() => {
        spyOn(modalService, 'open').and.callThrough();
        spyOn(verificationsNSecurityTrackingEventsService, 'trackStartEmailVerificationProcessEvent');
        const verifyButton: HTMLElement = fixture.debugElement.query(By.css('.EmailVerificationModal__verify-btn')).nativeElement;
        verifyButton.click();
        fixture.detectChanges();
      });
      it('should close the current modal and open the thanks email modal', () => {
        expect(activeModal.close).toHaveBeenCalledTimes(1);
        expect(activeModal.close).toHaveBeenCalled();
        expect(modalService.open).toHaveBeenCalledWith(EmailThanksModalComponent, {
          windowClass: 'modal-standard',
        });
      });
      it('should track the start email verification process', () => {
        expect(verificationsNSecurityTrackingEventsService.trackStartEmailVerificationProcessEvent).toHaveBeenCalledTimes(1);
        expect(verificationsNSecurityTrackingEventsService.trackStartEmailVerificationProcessEvent).toHaveBeenCalled();
      });
    });
  });
});
