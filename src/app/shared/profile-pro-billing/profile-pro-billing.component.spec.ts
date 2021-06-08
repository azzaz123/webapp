import { throwError, of } from 'rxjs';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { COMPONENT_TYPE, ProfileProBillingComponent } from './profile-pro-billing.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteInfoConfirmationModalComponent } from './delete-info-confirmation-modal/delete-info-confirmation-modal.component';
import { PaymentService } from '../../core/payments/payment.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { BILLING_INFO_RESPONSE, BILLING_INFO_RESPONSE_LEGAL } from '../../../tests/payments.fixtures.spec';
import { ProfileFormComponent } from '../../shared/profile/profile-form/profile-form.component';
import { EventService } from 'app/core/event/event.service';
import { By } from '@angular/platform-browser';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

describe('ProfileProBillingComponent', () => {
  let component: ProfileProBillingComponent;
  let fixture: ComponentFixture<ProfileProBillingComponent>;
  let paymentService: PaymentService;
  let errorsService: ErrorsService;
  let modalService: NgbModal;
  let HTMLelement: DebugElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [ProfileProBillingComponent],
        providers: [
          EventService,
          {
            provide: PaymentService,
            useValue: {
              updateBillingInfo() {
                return of({});
              },
              getBillingInfo() {
                return of(BILLING_INFO_RESPONSE);
              },
              deleteBillingInfo() {
                return of({});
              },
            },
          },
          {
            provide: ErrorsService,
            useValue: {
              show() {},
              i18nSuccess() {},
              i18nError() {},
            },
          },
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  result: Promise.resolve(true),
                };
              },
            },
          },
          {
            provide: ProfileFormComponent,
            useValue: {
              initFormControl() {},
              canExit() {},
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    modalService = TestBed.inject(NgbModal);
    fixture = TestBed.createComponent(ProfileProBillingComponent);
    component = fixture.componentInstance;
    paymentService = TestBed.inject(PaymentService);
    errorsService = TestBed.inject(ErrorsService);
    component.formComponent = TestBed.inject(ProfileFormComponent);
    HTMLelement = fixture.debugElement;
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
      expect(component.billingForm.getRawValue()).toEqual({
        ...BILLING_INFO_RESPONSE,
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
        spyOn(component.billingInfoFormSaved, 'emit').and.callThrough();
        spyOn(paymentService, 'getBillingInfo').and.returnValue(of(BILLING_INFO_RESPONSE_LEGAL));

        component.onSubmit();

        expect(paymentService.updateBillingInfo).toHaveBeenCalledWith(component.billingForm.getRawValue());
        expect(component.isNewBillingInfoForm).toBe(false);
        expect(component.billingInfoFormSaved.emit).toHaveBeenCalledWith(component.billingForm);
      });

      it('should show error if call fails', () => {
        spyOn(errorsService, 'show');
        spyOn(paymentService, 'updateBillingInfo').and.returnValue(throwError('error'));

        component.onSubmit();

        expect(errorsService.show).toHaveBeenCalledWith('error');
      });
    });

    describe('form not valid', () => {
      it('should set invalid fields as dirty', () => {
        component.billingForm.patchValue({
          cif: 'A00000000',
          company_name: 'company',
          email: 'email@email.com',
          name: 'name',
          postal_code: '12345',
          street: 'street',
          surname: 'surname',
          id: '123',
          type: 'legal',
        });

        HTMLelement.query(By.css('form')).triggerEventHandler('submit', null);

        expect(component.billingForm.get('country').dirty).toBe(true);
      });

      it('should set cif as invalid', () => {
        component.billingForm.patchValue({
          cif: 'A000',
          company_name: 'company',
          email: 'email@email.com',
          name: 'name',
          postal_code: '12345',
          street: 'street',
          surname: 'surname',
          id: '123',
          type: 'legal',
          country: 'catalonia',
        });

        HTMLelement.queryAll(By.css('tsl-button'))[0].nativeElement.click();

        expect(component.billingForm.valid).toBeFalsy();
      });
    });

    describe('deleteBillingInfo', () => {
      beforeEach(() => {
        component.billingForm.patchValue(BILLING_INFO_RESPONSE);
      });

      it('should call open modalservice method', () => {
        spyOn(modalService, 'open').and.callThrough();

        component.deleteBillingInfo();

        expect(modalService.open).toHaveBeenCalledWith(DeleteInfoConfirmationModalComponent);
      });

      describe('if user confirm modal', () => {
        beforeEach(fakeAsync(() => {
          spyOn(modalService, 'open').and.returnValue({
            result: Promise.resolve(true),
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

          expect(errorsService.i18nSuccess).toHaveBeenCalledWith(TRANSLATION_KEY.DELETE_BILLING_INFO);
        }));

        it('all reset form and set true isnewbillinginfo boolean', fakeAsync(() => {
          spyOn(component, 'initForm').and.callThrough();
          spyOn(paymentService, 'getBillingInfo').and.returnValue(throwError('404'));

          component.deleteBillingInfo();
          tick();

          expect(component.initForm).toHaveBeenCalled();
          expect(component.isNewBillingInfoForm).toBe(true);
        }));

        it('should show an 18n error message if the action has an error', fakeAsync(() => {
          spyOn(paymentService, 'deleteBillingInfo').and.returnValue(throwError(''));
          spyOn(errorsService, 'i18nError');

          component.deleteBillingInfo();
          tick();

          expect(errorsService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.DELETE_BILLING_INFO_ERROR);
        }));
      });

      it('should not enter inside modal', fakeAsync(() => {
        spyOn(modalService, 'open').and.returnValue({
          result: Promise.resolve(),
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

  describe('when we fill the form...', () => {
    const validForm = {
      cif: '06353225G',
      company_name: 'Wallapop',
      email: 'wallapop@wallapop.com',
      name: 'Wallapop',
      surname: 'Wallapop',
    };

    const invalidForm = {
      cif: null,
      company_name: null,
      email: null,
      name: null,
      surname: null,
    };
    describe('when the invoice is for a natural person...', () => {
      beforeEach(() => {
        component.type = 'natural';
      });

      it('should show errors when the form is incorrect', () => {
        component.billingForm.patchValue(invalidForm);

        fixture.detectChanges();

        component.onSubmit();
        fixture.detectChanges();
        const errorMessages = HTMLelement.queryAll(By.css('.alert'));

        expect(errorMessages.length).toBe(4);
      });

      it('should NOT show errors when the form is correct', () => {
        component.billingForm.patchValue(validForm);

        fixture.detectChanges();

        component.onSubmit();
        fixture.detectChanges();
        const errorMessages = HTMLelement.queryAll(By.css('.alert'));

        expect(errorMessages.length).toBe(0);
      });
    });

    describe('when the invoice is for a legal person...', () => {
      beforeEach(() => {
        component.type = 'legal';
      });

      it('should show errors when the form is incorrect', () => {
        component.billingForm.patchValue(invalidForm);

        fixture.detectChanges();

        component.onSubmit();
        fixture.detectChanges();
        const errorMessages = HTMLelement.queryAll(By.css('.alert'));

        expect(errorMessages.length).toBe(3);
      });

      it('should NOT show errors when the form is correct', () => {
        component.billingForm.patchValue(validForm);

        fixture.detectChanges();

        component.onSubmit();
        fixture.detectChanges();
        const errorMessages = HTMLelement.queryAll(By.css('.alert'));

        expect(errorMessages.length).toBe(0);
      });
    });
  });
});
