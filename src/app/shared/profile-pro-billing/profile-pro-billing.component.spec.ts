
import {throwError as observableThrowError,  Observable, of } from 'rxjs';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ProfileProBillingComponent } from './profile-pro-billing.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteInfoConfirmationModalComponent } from './delete-info-confirmation-modal/delete-info-confirmation-modal.component';
import { PaymentService } from '../../core/payments/payment.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { BILLING_INFO_RESPONSE } from '../../../tests/payments.fixtures.spec';
import { ProfileFormComponent } from '../../shared/profile/profile-form/profile-form.component';

describe('ProfileProBillingComponent', () => {
  let component: ProfileProBillingComponent;
  let fixture: ComponentFixture<ProfileProBillingComponent>;
  let paymentService: PaymentService;
  let errorsService: ErrorsService;
  let modalService: NgbModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [ProfileProBillingComponent],
      providers: [
        {
          provide: PaymentService, useValue: {
            updateBillingInfo() {
              return of({});
            },
            getBillingInfo() {
              return of(BILLING_INFO_RESPONSE);
            },
            deleteBillingInfo() {
              return of({});
            }
          }
        },
        {
          provide: ErrorsService, useValue: {
            show() {
            },
            i18nSuccess() {
            },
            i18nError() {
            }
          }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(true)
              };
            }
          }
        },
        {
          provide: ProfileFormComponent, useValue: {
            initFormControl() { },
            canExit() { }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    modalService = TestBed.get(NgbModal);
    fixture = TestBed.createComponent(ProfileProBillingComponent);
    component = fixture.componentInstance;
    paymentService = TestBed.get(PaymentService);
    errorsService = TestBed.get(ErrorsService);
    component.formComponent = TestBed.get(ProfileFormComponent);
    fixture.detectChanges();
  });

  describe('initForm', () => {
    beforeEach(() => {
      spyOn(paymentService, 'getBillingInfo').and.callThrough();

      component.initForm();
    });

    it('should call getBillingInfo', () => {
      expect(paymentService.getBillingInfo).toHaveBeenCalled();
    });

    it('should set form value with billing info', () => {
      expect(component.billingForm.value).toEqual({
        ...BILLING_INFO_RESPONSE
      });
    });
  });

  describe('onSubmit', () => {
    describe('form valid', () => {
      beforeEach(() => {
        component.billingForm.patchValue(BILLING_INFO_RESPONSE);
      });

      it('should update billing info and should put false isnewBillingInfoForm boolean', () => {
        spyOn(paymentService, 'updateBillingInfo').and.callThrough();

        component.onSubmit();

        expect(paymentService.updateBillingInfo).toHaveBeenCalledWith(component.billingForm.value);
        expect(component.isNewBillingInfoForm).toBe(false);
      });

      it('should show error if call fails', () => {
        spyOn(errorsService, 'show');
        spyOn(paymentService, 'updateBillingInfo').and.returnValue(observableThrowError('error'));

        component.onSubmit();

        expect(errorsService.show).toHaveBeenCalledWith('error');
      });
    });

    describe('form not valid', () => {
      it('should set invalid fields as dirty', () => {
        component.billingForm.patchValue({
          cif: 'cif',
          company_name: 'company',
          email: 'email@email.com',
          name: 'name',
          phone: '666666666',
          postal_code: '12345',
          street: 'street',
          surname: 'surname',
          id: '123',
          type: 'legal'
        });

        component.onSubmit();

        expect(component.billingForm.get('country').dirty).toBe(true);
      });
    });

    describe('deleteBillingInfo', () => {
      beforeEach(() => {
        component.billingForm.patchValue({
          cif: 'cif',
          company_name: 'company',
          email: 'email@email.com',
          name: 'name',
          phone: '666666666',
          postal_code: '12345',
          street: 'street',
          surname: 'surname',
          id: '123',
          type: 'legal'
        });
      });

      it('should call open modalservice method', () => {
        spyOn(modalService, 'open').and.callThrough();

        component.deleteBillingInfo();

        expect(modalService.open).toHaveBeenCalledWith(DeleteInfoConfirmationModalComponent);
      });

      describe('if user confirm modal', () => {
        beforeEach(fakeAsync(() => {
          spyOn(modalService, 'open').and.returnValue({
            result: Promise.resolve(true)
          });
        }));

        it('should call payments service deleteBillingInfo method with ID', fakeAsync(() => {
          spyOn(paymentService, 'deleteBillingInfo').and.callThrough();

          component.deleteBillingInfo();
          tick();

          expect(paymentService.deleteBillingInfo).toHaveBeenCalledWith('123');
        }));

        it('should show an 18n success message if the action has been success', fakeAsync(() => {
          spyOn(errorsService, 'i18nSuccess');
          spyOn(paymentService, 'deleteBillingInfo').and.callThrough();

          component.deleteBillingInfo();
          tick();

          expect(errorsService.i18nSuccess).toHaveBeenCalledWith('deleteBillingInfoSuccess');
        }));

        it('all reset form and set true isnewbillinginfo boolean', fakeAsync(() => {
          spyOn(component.billingForm, 'reset').and.callThrough();

          component.deleteBillingInfo();
          tick();

          expect(component.billingForm.reset).toHaveBeenCalled();
          expect(component.isNewBillingInfoForm).toBe(true);
        }));

        it('should show an 18n error message if the action has an error', fakeAsync(() => {
          spyOn(paymentService, 'deleteBillingInfo').and.returnValue(observableThrowError(''));
          spyOn(errorsService, 'i18nError');

          component.deleteBillingInfo();
          tick();

          expect(errorsService.i18nError).toHaveBeenCalledWith('deleteBillingInfoError');
        }));
      });

      it('should not enter inside modal', fakeAsync(() => {
        spyOn(modalService, 'open').and.returnValue({
          result: Promise.resolve()
        });
        spyOn(paymentService, 'deleteBillingInfo').and.callThrough();

        component.deleteBillingInfo();
        tick();

        expect(paymentService.deleteBillingInfo).not.toHaveBeenCalled();
      }));
    });

    describe('canExit', () => {
      it('should call formComponent canExit method', () => {
        spyOn(component.formComponent, 'canExit');

        component.canExit();

        expect(component.formComponent.canExit).toHaveBeenCalled();
      });
    });

  });
});
