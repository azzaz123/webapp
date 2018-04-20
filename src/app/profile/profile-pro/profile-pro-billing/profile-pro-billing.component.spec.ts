import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProBillingComponent } from './profile-pro-billing.component';
import { BILLING_INFO_RESPONSE } from '../../../../tests/payments.fixtures.spec';
import { Observable } from 'rxjs/Observable';
import { PaymentService } from '../../../core/payments/payment.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProfileProBillingComponent', () => {
  let component: ProfileProBillingComponent;
  let fixture: ComponentFixture<ProfileProBillingComponent>;
  let paymentService: PaymentService;
  let errorsService: ErrorsService;

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
            return Observable.of({});
          },
          getBillingInfo() {
            return Observable.of(BILLING_INFO_RESPONSE);
          }
        }
        },

        {
          provide: ErrorsService, useValue: {
          show() {
          },
          i18nSuccess() {
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    paymentService = TestBed.get(PaymentService);
    errorsService = TestBed.get(ErrorsService);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(paymentService, 'getBillingInfo').and.callThrough();

      component.ngOnInit();
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
        component.billingForm.patchValue({
          cif: 'cif',
          city: 'city',
          company_name: 'company',
          country: 'country',
          email: 'email@email.com',
          name: 'name',
          phone: '666666666',
          postal_code: '12345',
          street: 'street',
          surname: 'surname',
          id: '123'
        });
      });

      it('should update billing info', () => {
        spyOn(paymentService, 'updateBillingInfo').and.callThrough();

        component.onSubmit();

        expect(paymentService.updateBillingInfo).toHaveBeenCalledWith(component.billingForm.value);
      });

      it('should show error if call fails', () => {
        spyOn(errorsService, 'show');
        spyOn(paymentService, 'updateBillingInfo').and.returnValue(Observable.throw('error'));

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
          id: '123'
        });

        component.onSubmit();

        expect(component.billingForm.get('city').dirty).toBeTruthy();
        expect(component.billingForm.get('country').dirty).toBeTruthy();
      });
    });
  });
});
