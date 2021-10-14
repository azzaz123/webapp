import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailModalComponent } from '@shared/profile/edit-email/email-modal/email-modal.component';
import { of } from 'rxjs';
import { VerificationEmailThanksModalComponent } from '../verification-email-thanks-modal/verification-email-thanks-modal.component';
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
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    modalService = TestBed.inject(NgbModal);
    activeModal = TestBed.inject(NgbActiveModal);
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
        component.changeEmail();

        expect(activeModal.close).toHaveBeenCalled();
        expect(modalService.open).toHaveBeenCalledWith(EmailModalComponent, {
          windowClass: 'modal-standard',
        });
      });
    });
  });

  describe('Verify Button', () => {
    describe('when verify button is clicked', () => {
      it('should close the current modal and open the thanks email modal', () => {
        spyOn(modalService, 'open').and.callThrough();
        component.verifyEmail();

        expect(activeModal.close).toHaveBeenCalled();
        expect(modalService.open).toHaveBeenCalledWith(VerificationEmailThanksModalComponent, {
          windowClass: 'modal-standard',
        });
      });
    });
  });
});
