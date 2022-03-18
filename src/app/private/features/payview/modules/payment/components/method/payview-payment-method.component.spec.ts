import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { DeliveryRadioSelectorComponent } from '@private/shared/delivery-radio-selector/delivery-radio-selector.component';
import { DeliveryRadioSelectorModule } from '@private/shared/delivery-radio-selector/delivery-radio-selector.module';
import { MOCK_CREDIT_CARD } from '@api/fixtures/payments/cards/credit-card.fixtures.spec';
import { MOCK_PAYMENTS_PAYMENT_METHODS } from '@api/fixtures/payments/payment-methods/payments-payment-methods-dto.fixtures.spec';
import { PayviewPaymentHeaderComponent } from '@private/features/payview/modules/payment/components/header/payview-payment-header.component';
import { PayviewPaymentMethodComponent } from '@private/features/payview/modules/payment/components/method/payview-payment-method.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

describe('PayviewPaymentMethodComponent', () => {
  const payviewPaymentMethod: string = '.PayviewPaymentMethod';
  const payviewPaymentMethodDescriptionSelector: string = `${payviewPaymentMethod}__methodDescription`;
  const payviewPaymentMethodDescriptionTitleSelector: string = `${payviewPaymentMethodDescriptionSelector} > span`;
  const payviewPaymentMethodInformationWrapperSelector: string = `${payviewPaymentMethod}__informationWrapper`;

  let component: PayviewPaymentMethodComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewPaymentMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent, PayviewPaymentHeaderComponent, PayviewPaymentMethodComponent, SvgIconComponent],
      imports: [BrowserAnimationsModule, DeliveryRadioSelectorModule, HttpClientTestingModule],
    }).compileComponents();
  });

  describe('WHEN initializes', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewPaymentMethodComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      component.card = { ...MOCK_CREDIT_CARD };
      component.method = MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[0];
      component.id = 1;
      component.isChecked = false;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('WHEN the payment method has been reported', () => {
      describe('WHEN the payment method is PayPal', () => {
        beforeEach(() => {
          fixture = TestBed.createComponent(PayviewPaymentMethodComponent);
          component = fixture.componentInstance;
          debugElement = fixture.debugElement;

          component.card = { ...MOCK_CREDIT_CARD };
          component.method = MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[0];
          component.id = 0;
          component.isChecked = false;

          fixture.detectChanges();
        });

        it('should show the payment method', () => {
          const target = debugElement.query(By.css(payviewPaymentMethodDescriptionSelector));

          expect(target).toBeTruthy();
        });

        it('should have a PayPal method', () => {
          const expected: string = $localize`:@@pay_view_buyer_payment_method_paypal_label:PayPal`;

          const result: boolean = debugElement
            .queryAll(By.css(payviewPaymentMethodDescriptionTitleSelector))
            .some((tag) => tag.nativeElement.innerHTML === expected);

          expect(result).toBe(true);
        });

        describe('WHEN the payment method is selected', () => {
          beforeEach(() => {
            fixture = TestBed.createComponent(PayviewPaymentMethodComponent);
            component = fixture.componentInstance;
            debugElement = fixture.debugElement;

            component.card = { ...MOCK_CREDIT_CARD };
            component.method = MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[0];
            component.id = 0;
            component.isChecked = true;

            fixture.detectChanges();
          });

          it('should not show additional information', () => {
            const target = debugElement.query(By.css(payviewPaymentMethodInformationWrapperSelector));

            expect(target).toBeFalsy();
          });
        });
      });

      describe('WHEN the payment method is credit card', () => {
        beforeEach(() => {
          fixture = TestBed.createComponent(PayviewPaymentMethodComponent);
          component = fixture.componentInstance;
          debugElement = fixture.debugElement;

          component.card = { ...MOCK_CREDIT_CARD };
          component.method = MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[1];
          component.id = 1;
          component.isChecked = false;

          fixture.detectChanges();
        });

        it('should show the payment method', () => {
          const target = debugElement.query(By.css(payviewPaymentMethodDescriptionSelector));

          expect(target).toBeTruthy();
        });

        it('should have a credit card number', () => {
          const expected: string = $localize`:@@pay_view_buyer_payment_method_credit_card_masked_number:Credit card •••• ${MOCK_CREDIT_CARD.lastFourDigits}`;

          const target = debugElement.query(By.css(payviewPaymentMethodDescriptionTitleSelector));

          expect(target.nativeElement.innerHTML).toBe(expected);
        });

        it('should not have a credit card title', () => {
          const expected: string = $localize`:@@pay_view_buyer_payment_method_credit_card_label:Credit card`;

          const target = debugElement.query(By.css(payviewPaymentMethodDescriptionTitleSelector));

          expect(target.nativeElement.innerHTML).not.toBe(expected);
        });

        describe('WHEN we do not have credit card', () => {
          let changeDetectorRef: ChangeDetectorRef;

          beforeEach(() => {
            component.card.lastFourDigits = null;

            changeDetectorRef = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
            changeDetectorRef.detectChanges();
          });

          it('should show the payment method', () => {
            const target = debugElement.query(By.css(payviewPaymentMethodDescriptionSelector));

            expect(target).toBeTruthy();
          });

          it('should not have a credit card number', () => {
            const expected: string = $localize`:@@pay_view_buyer_payment_method_credit_card_masked_number:Credit card •••• ${MOCK_CREDIT_CARD.lastFourDigits}`;

            const target = debugElement.query(By.css(payviewPaymentMethodDescriptionTitleSelector));

            expect(target.nativeElement.innerHTML).not.toBe(expected);
          });

          it('should have a credit card title', () => {
            const expected: string = $localize`:@@pay_view_buyer_payment_method_credit_card_label:Credit card`;

            const target = debugElement.query(By.css(payviewPaymentMethodDescriptionTitleSelector));

            expect(target.nativeElement.innerHTML).toBe(expected);
          });
        });

        describe('WHEN the payment method is selected', () => {
          beforeEach(() => {
            fixture = TestBed.createComponent(PayviewPaymentMethodComponent);
            component = fixture.componentInstance;
            debugElement = fixture.debugElement;

            component.card = { ...MOCK_CREDIT_CARD };
            component.method = MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[1];
            component.id = 1;
            component.isChecked = true;

            fixture.detectChanges();
          });

          it('should show additional information', () => {
            const target = debugElement.query(By.css(payviewPaymentMethodInformationWrapperSelector));

            expect(target).toBeTruthy();
          });

          describe('WHEN there is previous credit card selected', () => {
            it('should show a button with "Change credit card" message', () => {
              const expected: string = $localize`:@@pay_view_buyer_payment_method_credit_card_edit_button:Change credit card`;

              expect(component.actionTitle).toBe(expected);
            });
          });

          describe('WHEN there is not previous home pick-up selected', () => {
            beforeEach(() => {
              fixture = TestBed.createComponent(PayviewPaymentMethodComponent);
              component = fixture.componentInstance;
              debugElement = fixture.debugElement;

              component.card = null;
              component.method = MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[1];
              component.id = 1;
              component.isChecked = true;

              fixture.detectChanges();
            });

            it('should show a button with "Add credit card" message', () => {
              const expected: string = $localize`:@@pay_view_buyer_payment_method_credit_card_add_button:Add credit card`;

              expect(component.actionTitle).toBe(expected);
            });
          });
        });
      });
    });
  });

  describe('WHEN the item has been selected', () => {
    const fakeIndex: number = 13;

    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewPaymentMethodComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      spyOn(component.checked, 'emit');

      component.card = { ...MOCK_CREDIT_CARD };
      component.method = MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[1];
      component.id = fakeIndex;
      component.isChecked = true;

      fixture.detectChanges();

      const paymentOptionSelector: DebugElement = fixture.debugElement.query(By.directive(DeliveryRadioSelectorComponent));
      paymentOptionSelector.triggerEventHandler('changed', null);
    });

    it('should emit the selected index', () => {
      expect(component.checked.emit).toHaveBeenCalledTimes(1);
      expect(component.checked.emit).toHaveBeenCalledWith(fakeIndex);
    });
  });

  describe('WHEN the user clicks over the button', () => {
    const fakeIndex: number = 13;

    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewPaymentMethodComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      spyOn(component.edited, 'emit');

      component.card = { ...MOCK_CREDIT_CARD };
      component.method = MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[1];
      component.id = fakeIndex;
      component.isChecked = true;

      fixture.detectChanges();

      const paymentButtonSelector: DebugElement = fixture.debugElement.query(By.directive(ButtonComponent));
      paymentButtonSelector.triggerEventHandler('click', null);
    });

    it('should emit the selected index', () => {
      expect(component.edited.emit).toHaveBeenCalledTimes(1);
      expect(component.edited.emit).toHaveBeenCalledWith(fakeIndex);
    });
  });
});
