import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UserVerificationsService } from '@api/user-verifications/user-verifications.service';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownComponent } from '@shared/dropdown/dropdown.component';
import { of } from 'rxjs';
import { PhoneVerificationModalComponent } from './phone-verification-modal.component';

@Component({
  selector: 'tsl-svg-icon',
  template: '',
})
class MockSvgIconComponent {}

describe('PhoneVerificationModalComponent', () => {
  let component: PhoneVerificationModalComponent;
  let fixture: ComponentFixture<PhoneVerificationModalComponent>;
  let activeModal: NgbActiveModal;
  let userVerificationsService: UserVerificationsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [PhoneVerificationModalComponent, DropdownComponent, MockSvgIconComponent],
      providers: [
        NgbActiveModal,
        FormBuilder,
        ToastService,
        {
          provide: UserVerificationsService,
          useValue: {
            verifyPhone() {
              return of({});
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneVerificationModalComponent);
    userVerificationsService = TestBed.inject(UserVerificationsService);
    activeModal = TestBed.inject(NgbActiveModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(activeModal, 'close').and.callThrough();
    spyOn(activeModal, 'dismiss').and.callThrough();
    spyOn(userVerificationsService, 'verifyPhone').and.callThrough();
  });

  describe('when close button is clicked', () => {
    it('should dismiss the modal', () => {
      const closeButton: HTMLElement = fixture.debugElement.query(By.css('.PhoneVerificationModal__close')).nativeElement;

      closeButton.click();

      expect(activeModal.dismiss).toHaveBeenCalled();
    });
  });

  describe('onSubmitPhone', () => {
    describe('when the phone number is valid', () => {
      beforeEach(() => {
        component.phoneVerificationForm.patchValue({ prefix: '+34', phone: '935500996' });
      });

      it('should call the verifyPhone and close the modal', () => {
        component.onSubmitPhone();

        expect(userVerificationsService.verifyPhone).toHaveBeenCalledTimes(1);
        expect(activeModal.close).toHaveBeenCalled();
      });
    });

    describe('when the phone number is not valid', () => {
      beforeEach(() => {
        spyOn(component, 'onSubmitPhone').and.callThrough();
        component.phoneVerificationForm.patchValue({ prefix: '', phone: '' });

        component.onSubmitPhone();
      });

      it('should mark as dirty the invalid phone form control', () => {
        expect(userVerificationsService.verifyPhone).not.toHaveBeenCalled();
        expect(component.phoneVerificationForm.get('phone').valid).toBe(false);
        expect(component.phoneVerificationForm.get('phone').dirty).toBe(true);
      });
    });
  });
});
