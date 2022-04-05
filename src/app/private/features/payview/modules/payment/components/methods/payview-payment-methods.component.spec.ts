import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { DeliveryRadioSelectorModule } from '@private/shared/delivery-radio-selector/delivery-radio-selector.module';
import { I18nService } from '@core/i18n/i18n.service';
import { MOCK_CREDIT_CARD } from '@api/fixtures/payments/cards/credit-card.fixtures.spec';
import { MOCK_PAYMENTS_PAYMENT_METHODS } from '@api/fixtures/payments/payment-methods/payments-payment-methods-dto.fixtures.spec';
import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments/enums/payment-method.enum';
import { PayviewPaymentHeaderComponent } from '@private/features/payview/modules/payment/components/header/payview-payment-header.component';
import { PayviewPaymentMethodComponent } from '@private/features/payview/modules/payment/components/method/payview-payment-method.component';
import { PayviewPaymentMethodsComponent } from '@private/features/payview/modules/payment/components/methods/payview-payment-methods.component';
import { PayviewPaymentService } from '@private/features/payview/modules/payment/services/payview-payment.service';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

@Component({
  selector: 'tsl-payview-payment-method',
  template: '',
})
class FakePayviewPaymentMethodComponent extends PayviewPaymentMethodComponent {
  constructor(i18nService: I18nService) {
    super(i18nService);
  }
}

@Component({
  selector: 'tsl-credit-card',
  template: '',
})
class FakeCreditCardComponent {}

describe('PayviewPaymentMethodsComponent', () => {
  const payviewPaymentMethods: string = '.PayviewPaymentMethods';

  let component: PayviewPaymentMethodsComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewPaymentMethodsComponent>;
  let payviewPaymentService: PayviewPaymentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ButtonComponent,
        FakeCreditCardComponent,
        FakePayviewPaymentMethodComponent,
        PayviewPaymentHeaderComponent,
        PayviewPaymentMethodsComponent,
        SvgIconComponent,
      ],
      imports: [DeliveryRadioSelectorModule, HttpClientTestingModule],
      providers: [PayviewPaymentService],
    }).compileComponents();
  });

  describe('WHEN initializes', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewPaymentMethodsComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('WHEN the payment methods have been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewPaymentMethodsComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.card = MOCK_CREDIT_CARD;
        component.defaultMethod = PAYVIEW_PAYMENT_METHOD.WALLET;
        component.methods = MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods;

        fixture.detectChanges();
      });

      it('should show all the payment methods', () => {
        const target = debugElement.queryAll(By.directive(FakePayviewPaymentMethodComponent)).length;

        expect(target).toBe(component.methods.length);
      });

      describe('WHEN the payment method is PayPal', () => {
        let targetElement: DebugElement;

        beforeEach(() => {
          targetElement = debugElement.queryAll(By.directive(FakePayviewPaymentMethodComponent))[0];
        });

        it('should assign the corresponding credit card', () => {
          expect(targetElement.componentInstance.card).toEqual(MOCK_CREDIT_CARD);
        });

        it('should assign the corresponding payment method', () => {
          expect(targetElement.componentInstance.method).toEqual(MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[0]);
        });

        it('should assign the corresponding id', () => {
          expect(targetElement.componentInstance.id).toEqual(0);
        });

        it('should assign whether is checked or not', () => {
          expect(targetElement.componentInstance.isChecked).toBeFalsy();
        });
      });

      describe('WHEN the payment method is credit card', () => {
        let targetElement: DebugElement;

        beforeEach(() => {
          targetElement = debugElement.queryAll(By.directive(FakePayviewPaymentMethodComponent))[1];
        });

        it('should assign the corresponding payment costs', () => {
          expect(targetElement.componentInstance.card).toEqual(MOCK_CREDIT_CARD);
        });

        it('should assign the corresponding payment method', () => {
          expect(targetElement.componentInstance.method).toEqual(MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[1]);
        });

        it('should assign the corresponding id', () => {
          expect(targetElement.componentInstance.id).toEqual(1);
        });

        it('should assign whether is checked or not', () => {
          expect(targetElement.componentInstance.isChecked).toBeFalsy();
        });
      });
    });

    describe('WHEN the payment methods have not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewPaymentMethodsComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.methods = null;

        fixture.detectChanges();
      });

      it('should not show any payment method', () => {
        const target = debugElement.query(By.css(payviewPaymentMethods));

        expect(target).toBeFalsy();
      });
    });
  });

  describe('WHEN the item has been selected', () => {
    let paymentServiceSpy;
    const fakeIndex: number = 1;

    beforeEach(() => {
      payviewPaymentService = TestBed.inject(PayviewPaymentService);
      paymentServiceSpy = spyOn(payviewPaymentService, 'setPaymentMethod').and.callFake(() => {});

      fixture = TestBed.createComponent(PayviewPaymentMethodsComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      component.card = MOCK_CREDIT_CARD;
      component.defaultMethod = PAYVIEW_PAYMENT_METHOD.PAYPAL;
      component.methods = MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods;

      fixture.detectChanges();

      const paymentMethodDebugElement: DebugElement = fixture.debugElement.query(By.directive(FakePayviewPaymentMethodComponent));
      paymentMethodDebugElement.triggerEventHandler('checked', fakeIndex);
    });

    it('should indicate that the item is selected', () => {
      expect(component.isSelected(fakeIndex)).toBe(true);
    });

    it('should set the payment method selected', () => {
      expect(paymentServiceSpy).toHaveBeenCalledTimes(1);
      expect(paymentServiceSpy).toHaveBeenCalledWith(component.methods[fakeIndex]);
    });
  });

  describe('WHEN the edit method has been called', () => {
    describe('AND WHEN the edited method is the credit card', () => {
      let paymentServiceSpy;
      const fakeIndex: number = 1;

      beforeEach(() => {
        payviewPaymentService = TestBed.inject(PayviewPaymentService);
        paymentServiceSpy = spyOn(payviewPaymentService, 'editCreditCard').and.callFake(() => {});
        fixture = TestBed.createComponent(PayviewPaymentMethodsComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.card = MOCK_CREDIT_CARD;
        component.defaultMethod = PAYVIEW_PAYMENT_METHOD.CREDIT_CARD;
        component.methods = MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods;

        fixture.detectChanges();

        const deliveryOptionSelector: DebugElement = fixture.debugElement.query(By.directive(FakePayviewPaymentMethodComponent));
        deliveryOptionSelector.triggerEventHandler('edited', fakeIndex);
      });

      it('should raise the event corresponding to the credit card edition', fakeAsync(() => {
        expect(paymentServiceSpy).toHaveBeenCalledTimes(1);
      }));
    });
  });

  describe('WHEN any method has been selected', () => {
    let deliveryServiceSpy;

    beforeEach(() => {
      deliveryServiceSpy = spyOn(payviewPaymentService, 'setPaymentMethod').and.callFake(() => {});

      fixture.detectChanges();
    });

    it('should raise the event corresponding to the payment method selection', () => {
      const fakeIndex: number = 1;
      component.selectMethod(fakeIndex);
      expect(deliveryServiceSpy).toHaveBeenCalledTimes(1);
      expect(deliveryServiceSpy).toHaveBeenCalledWith(component.methods[fakeIndex]);
    });
  });
});
