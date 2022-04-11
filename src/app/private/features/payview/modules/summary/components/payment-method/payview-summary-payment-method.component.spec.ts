import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MOCK_CREDIT_CARD } from '@api/fixtures/payments/cards/credit-card.fixtures.spec';
import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments/enums/payment-method.enum';
import { PayviewSummaryPaymentMethodComponent } from '@private/features/payview/modules/summary/components/payment-method/payview-summary-payment-method.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

describe('PayviewSummaryPaymentMethodComponent', () => {
  const iconPath: string = '/assets/icons/payview';
  const payviewSummaryPaymentMethod: string = '.PayviewSummaryPaymentMethod';
  const payviewSummaryPaymentMethodCurrent: string = `${payviewSummaryPaymentMethod}__paymentMethodCurrent`;
  const payviewSummaryPaymentMethodIcon: string = 'tsl-svg-icon';

  let component: PayviewSummaryPaymentMethodComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewSummaryPaymentMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewSummaryPaymentMethodComponent, SvgIconComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayviewSummaryPaymentMethodComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  describe('WHEN it initializes', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('WHEN the payment method has been reported', () => {
      beforeEach(() => {
        component.paymentMethod = { ...MOCK_PAYVIEW_STATE }.payment.preferences.preferences;

        fixture.detectChanges();
      });

      it('should show the payment method', () => {
        const target = debugElement.query(By.css(payviewSummaryPaymentMethod));

        expect(target).toBeTruthy();
      });

      describe('WHEN the payment method is PayPal', () => {
        beforeEach(() => {
          fixture = TestBed.createComponent(PayviewSummaryPaymentMethodComponent);
          component = fixture.componentInstance;
          debugElement = fixture.debugElement;
          component.paymentMethod = { ...MOCK_PAYVIEW_STATE }.payment.preferences.preferences;
          component.paymentMethod.paymentMethod = PAYVIEW_PAYMENT_METHOD.PAYPAL;

          fixture.detectChanges();
        });

        it('should show PayPal as a selected method', () => {
          const expected: string = $localize`:@@pay_view_buyer_summary_payment_paypal_label:PayPal`;
          const target = debugElement.query(By.css(payviewSummaryPaymentMethodCurrent));

          expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(expected);
        });

        it('should show the corresponding icon', () => {
          const expected: string = `${iconPath}/paypal.svg`;
          const target = debugElement.query(By.css(payviewSummaryPaymentMethodIcon));

          expect((target.componentInstance as SvgIconComponent).src).toBe(expected);
        });
      });

      describe('WHEN the payment method is credit card', () => {
        beforeEach(() => {
          fixture = TestBed.createComponent(PayviewSummaryPaymentMethodComponent);
          component = fixture.componentInstance;
          debugElement = fixture.debugElement;
          component.paymentMethod = { ...MOCK_PAYVIEW_STATE }.payment.preferences.preferences;
          component.creditCard = MOCK_CREDIT_CARD;
          component.paymentMethod.paymentMethod = PAYVIEW_PAYMENT_METHOD.CREDIT_CARD;

          fixture.detectChanges();
        });

        it('should show credit card as a selected method', () => {
          const expected: string = $localize`:@@pay_view_buyer_summary_payment_credit_card_label:Credit card •••• ${MOCK_CREDIT_CARD.lastFourDigits}`;
          const target = debugElement.query(By.css(payviewSummaryPaymentMethodCurrent));

          expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(expected);
        });

        it('should show the corresponding icon', () => {
          const expected: string = `${iconPath}/visa-mastercard.svg`;
          const target = debugElement.query(By.css(payviewSummaryPaymentMethodIcon));

          expect((target.componentInstance as SvgIconComponent).src).toBe(expected);
        });
      });
    });
  });

  describe('WHEN the payment method is not reported', () => {
    beforeEach(() => {
      component.paymentMethod = { ...MOCK_PAYVIEW_STATE }.payment.preferences.preferences;
      component.paymentMethod.paymentMethod = null;

      fixture.detectChanges();
    });

    it('should not show any selected method', () => {
      const target = debugElement.query(By.css(payviewSummaryPaymentMethodCurrent));

      expect(target).toBeFalsy();
    });
  });
});
