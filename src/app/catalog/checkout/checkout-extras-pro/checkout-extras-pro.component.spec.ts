import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutExtrasProComponent } from './checkout-extras-pro.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PaymentService } from '../../../core/payments/payment.service';
import { Observable } from 'rxjs/Observable';
import { createPacksFixture, PREPARED_PACKS } from '../../../../tests/payments.fixtures.spec';
import { FormGroup, FormControl } from '@angular/forms';


fdescribe('CheckoutExtrasProComponent', () => {
  let component: CheckoutExtrasProComponent;
  let fixture: ComponentFixture<CheckoutExtrasProComponent>;
  let paymentService: PaymentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutExtrasProComponent ],
      providers: [
        {
          provide: PaymentService, useValue: {
            getPacks() {
              return Observable.of({});
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutExtrasProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    paymentService = TestBed.get(PaymentService);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(paymentService, 'getPacks').and.returnValue(Observable.of(createPacksFixture()));

      component.ngOnInit();
    });

    it('should call paymentsService getPacks method', () => {
      expect(paymentService.getPacks).toHaveBeenCalled();
    });

    it('should preparePacks and return a understanding format', () => {
      expect(component.packs).toEqual(PREPARED_PACKS);
    });
  });

  describe('onBillingInfoChange', () => {
    const billingInfoForm = new FormGroup({
      cif: new FormControl(),
      city: new FormControl(),
      company_name: new FormControl(),
      country: new FormControl(),
      email: new FormControl(),
      name: new FormControl(),
      phone: new FormControl(),
      postal_code: new FormControl(),
      street: new FormControl(),
      surname: new FormControl(),
      id: new FormControl()
    });
    const billingInfoFormValues = {
      cif: 'cif',
      city: 'city',
      company_name: 'company_name',
      country: 'country',
      email: 'email',
      name: 'name',
      phone: 'phone',
      postal_code: 'postal_code',
      street: 'street',
      surname: 'surname',
      id: 'id'
    };

    it('should receive a form and set billingInfoForm with it', () => {
      billingInfoForm.patchValue(billingInfoFormValues);

      component.onBillingInfoChange(billingInfoForm);

      expect(component.billingInfoForm).toEqual(billingInfoForm);
    });
  });

  describe('onBillingInfoMissing', () => {
    it('should receive a bolean and set billingInfoFormEnabled with it', () => {
      component.onBillingInfoMissing(true);

      expect(component.billingInfoFormEnabled).toBe(true);
    });
  });
});
