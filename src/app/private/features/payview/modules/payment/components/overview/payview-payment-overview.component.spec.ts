import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { DeliveryRadioSelectorModule } from '@private/shared/delivery-radio-selector/delivery-radio-selector.module';
import { MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES } from '@api/fixtures/bff/payments/user-payment-preferences/payments-user-payment-preferences-dto.fixtures.spec';
import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { PayviewPaymentHeaderComponent } from '@private/features/payview/modules/payment/components/header/payview-payment-header.component';
import { PayviewPaymentOverviewComponent } from '@private/features/payview/modules/payment/components/overview/payview-payment-overview.component';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

@Component({
  selector: 'tsl-credit-card',
  template: '',
})
class FakeCreditCardComponent {}

@Component({
  selector: 'tsl-payview-payment-methods',
  template: '',
})
class FakePayviewPaymentMethodsComponent {
  @Input() card;
  @Input() defaultMethod;
  @Input() methods;
}

describe('PayviewPaymentOverviewComponent', () => {
  const payviewPaymentSelector: string = '.PayviewPayment';

  let component: PayviewPaymentOverviewComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewPaymentOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ButtonComponent,
        FakeCreditCardComponent,
        FakePayviewPaymentMethodsComponent,
        PayviewPaymentHeaderComponent,
        PayviewPaymentOverviewComponent,
        SvgIconComponent,
      ],
      imports: [BrowserAnimationsModule, DeliveryRadioSelectorModule, HttpClientTestingModule],
      providers: [],
    }).compileComponents();
  });

  describe('WHEN initializes', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewPaymentOverviewComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      const payviewState: PayviewState = { ...MOCK_PAYVIEW_STATE };
      component.card = payviewState.payment.card;
      component.methods = payviewState.payment.methods;
      component.preferences = payviewState.payment.preferences;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('WHEN payview state has been reported', () => {
      it('should show the payview block', () => {
        const target = debugElement.query(By.css(payviewPaymentSelector));

        expect(target).toBeTruthy();
      });

      describe('WHEN payment methods have been reported', () => {
        it('should show the payview block', () => {
          const target = debugElement.query(By.directive(FakePayviewPaymentMethodsComponent));

          expect(target).toBeTruthy();
        });

        it('should assign the corresponding default payment method', () => {
          const target = debugElement.query(By.directive(FakePayviewPaymentMethodsComponent));

          expect(target.componentInstance.defaultMethod).toEqual(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES.preferences.paymentMethod);
        });

        it('should assign the corresponding credit card', () => {
          const target = debugElement.query(By.directive(FakePayviewPaymentMethodsComponent));

          expect(target.componentInstance.card).toEqual(MOCK_PAYVIEW_STATE.payment.card);
        });

        describe('WHEN there are user preferences', () => {
          it('should assign the corresponding payment methods', () => {
            const target = debugElement.query(By.directive(FakePayviewPaymentMethodsComponent));

            expect(target.componentInstance.methods).toEqual(MOCK_PAYVIEW_STATE.payment.methods.paymentMethods);
          });
        });

        describe('WHEN there are not user preferences', () => {
          beforeEach(() => {
            fixture = TestBed.createComponent(PayviewPaymentOverviewComponent);
            component = fixture.componentInstance;
            debugElement = fixture.debugElement;

            const payviewState: PayviewState = { ...MOCK_PAYVIEW_STATE };
            component.card = payviewState.payment.card;
            component.methods = payviewState.payment.methods;
            component.preferences = payviewState.payment.preferences;
            component.preferences.defaults.paymentMethod = { ...MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES.preferences }.paymentMethod;
            component.preferences.preferences = null;

            fixture.detectChanges();
          });

          it('should assign the corresponding default payment methods', () => {
            const target = debugElement.query(By.directive(FakePayviewPaymentMethodsComponent));

            expect(target.componentInstance.defaultMethod).toEqual(MOCK_PAYVIEW_STATE.payment.preferences.defaults.paymentMethod);
          });
        });

        describe('WHEN there is not default preferences', () => {
          beforeEach(() => {
            fixture = TestBed.createComponent(PayviewPaymentOverviewComponent);
            component = fixture.componentInstance;
            debugElement = fixture.debugElement;

            const payviewState: PayviewState = { ...MOCK_PAYVIEW_STATE };
            component.card = payviewState.payment.card;
            component.methods = payviewState.payment.methods;
            component.preferences = payviewState.payment.preferences;
            component.preferences.defaults = null;
            component.preferences.preferences = null;

            fixture.detectChanges();
          });

          it('should not assign any payment method', () => {
            const target = debugElement.query(By.directive(FakePayviewPaymentMethodsComponent));

            expect(target.componentInstance.defaultMethod).toBeFalsy();
          });
        });
      });
    });

    describe('WHEN methods have not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewPaymentOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        const payviewState: PayviewState = { ...MOCK_PAYVIEW_STATE };
        component.card = payviewState.payment.card;
        component.methods = null;

        fixture.detectChanges();
      });

      it('should not show the payview block', () => {
        const target = debugElement.query(By.css(payviewPaymentSelector));

        expect(target).toBeFalsy();
      });
    });

    describe('WHEN credit card has not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewPaymentOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        const payviewState: PayviewState = { ...MOCK_PAYVIEW_STATE };
        component.card = null;
        component.methods = payviewState.payment.methods;

        fixture.detectChanges();
      });

      it('should show the payview block', () => {
        const target = debugElement.query(By.css(payviewPaymentSelector));

        expect(target).toBeTruthy();
      });
    });
  });
});
