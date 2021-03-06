import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PAYMENT_METHOD_CARD_RESPONSE, SETUP_INTENT_DATA } from '../../../../tests/payments.fixtures.spec';
import { StripeCardElementComponent } from './stripe-card-element.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';
import { of } from 'rxjs';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { STRIPE_ERROR } from '@core/stripe/stripe.interface';
import { ButtonModule } from '@shared/button/button.module';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '@shared/button/button.component';

describe('StripeCardElementComponent', () => {
  let component: StripeCardElementComponent;
  let fixture: ComponentFixture<StripeCardElementComponent>;
  let stripeService: StripeService;
  const stripeCardErrorSelector = '.StripeCard__error';
  const stripeCardInputErrorSelector = '.StripeElement--invalid';

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StripeCardElementComponent, ButtonComponent],
        imports: [ReactiveFormsModule, FormsModule],
        providers: [
          I18nService,
          ToastService,
          {
            provide: StripeService,
            useValue: {
              createStripeCard() {
                return Promise.resolve(PAYMENT_METHOD_CARD_RESPONSE[0]);
              },
              createDefaultCard() {
                return Promise.resolve(SETUP_INTENT_DATA);
              },
              getSetupIntent() {
                return of('abc');
              },
              createToken() {
                return Promise.resolve({ token: { id: '123' } });
              },
              lib: {
                elements: () => {
                  return {
                    create: () => {
                      return {
                        mount: () => {},
                        addEventListener: () => {},
                        removeEventListener: (type: string, listener: any) => {},
                        destroy: () => {},
                      };
                    },
                  };
                },
              },
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeCardElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    stripeService = TestBed.inject(StripeService);
  });

  describe('createNewCard', () => {
    it('should set newLoading to true when calling method', () => {
      component.createNewCard();

      expect(component.newLoading).toBe(true);
    });

    it('should call createStripeCard method from stripe service', () => {
      spyOn(stripeService, 'createStripeCard').and.callThrough();

      component.createNewCard();

      expect(stripeService.createStripeCard).toHaveBeenCalledTimes(1);
    });

    it('should emit stripe response when creating card', fakeAsync(() => {
      spyOn(component.handleStripeCardCreate, 'emit').and.callThrough();

      component.createNewCard();
      tick();

      expect(component.handleStripeCardCreate.emit).toHaveBeenCalledWith(PAYMENT_METHOD_CARD_RESPONSE[0]);
    }));
  });

  describe('setDefaultCard', () => {
    it('should set newLoading to true when calling method', () => {
      component.setDefaultCard();

      expect(component.newLoading).toBe(true);
    });

    it('should call getSetupIntent method from stripe service', () => {
      spyOn(stripeService, 'getSetupIntent').and.callThrough();

      component.setDefaultCard();

      expect(stripeService.getSetupIntent).toHaveBeenCalledTimes(1);
    });

    it('should emit stripe response when creating card', fakeAsync(() => {
      spyOn(component.handleStripeSetDefaultCard, 'emit').and.callThrough();
      spyOn(stripeService, 'createDefaultCard').and.callThrough();

      component.setDefaultCard();
      tick();

      expect(component.handleStripeSetDefaultCard.emit).toHaveBeenCalledWith(SETUP_INTENT_DATA.setupIntent);
    }));
  });

  describe('showUseSavedCard', () => {
    it('should emit handleClickUseSavedCard true when clicking on element', () => {
      spyOn(component.handleClickUseSavedCard, 'emit').and.callThrough();
      component.showUseSavedCard = true;
      component.type = 'subscription';
      fixture.detectChanges();
      const useSavedCardButton = fixture.debugElement.nativeElement.querySelector('.card-feedback__action');

      useSavedCardButton.click();

      expect(component.handleClickUseSavedCard.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('when there is a payment error', () => {
    it('should show decline card error message', () => {
      component.paymentError = STRIPE_ERROR.card_declined;
      fixture.detectChanges();

      const stripeCardError: HTMLElement = fixture.elementRef.nativeElement.querySelector(stripeCardErrorSelector);
      const stripeCardInputError: HTMLElement = fixture.elementRef.nativeElement.querySelector(stripeCardInputErrorSelector);
      expect(stripeCardError).toBeTruthy();
      expect(stripeCardError.textContent).toBe("Card number isn't valid.");
      expect(stripeCardInputError).toBeTruthy();
    });
    it('should show expired card error message', () => {
      component.paymentError = STRIPE_ERROR.expired_card;
      fixture.detectChanges();

      const stripeCardError: HTMLElement = fixture.elementRef.nativeElement.querySelector(stripeCardErrorSelector);
      const stripeCardInputError: HTMLElement = fixture.elementRef.nativeElement.querySelector(stripeCardInputErrorSelector);
      expect(stripeCardError).toBeTruthy();
      expect(stripeCardError.textContent).toBe("Card date isn't valid.");
      expect(stripeCardInputError).toBeTruthy();
    });
    it('should show decline card error message', () => {
      component.paymentError = STRIPE_ERROR.incorrect_cvc;
      fixture.detectChanges();

      const stripeCardError: HTMLElement = fixture.elementRef.nativeElement.querySelector(stripeCardErrorSelector);
      const stripeCardInputError: HTMLElement = fixture.elementRef.nativeElement.querySelector(stripeCardInputErrorSelector);
      expect(stripeCardError).toBeTruthy();
      expect(stripeCardError.textContent).toBe("CVC number isn't valid.");
      expect(stripeCardInputError).toBeTruthy();
    });
    it('should not show custom error message', () => {
      component.paymentError = 'test' as STRIPE_ERROR;
      fixture.detectChanges();

      const stripeCardError: HTMLElement = fixture.elementRef.nativeElement.querySelector(stripeCardErrorSelector);
      const stripeCardInputError: HTMLElement = fixture.elementRef.nativeElement.querySelector(stripeCardInputErrorSelector);
      expect(stripeCardError).toBeFalsy();
      expect(stripeCardInputError).toBeTruthy();
    });
    it('should not show error', () => {
      component.paymentError = null;
      fixture.detectChanges();

      const stripeCardError: HTMLElement = fixture.elementRef.nativeElement.querySelector(stripeCardErrorSelector);
      const stripeCardInputError: HTMLElement = fixture.elementRef.nativeElement.querySelector(stripeCardInputErrorSelector);
      expect(stripeCardError).toBeFalsy();
      expect(stripeCardInputError).toBeFalsy();
    });
  });
  describe('Bump button', () => {
    beforeEach(() => {
      component.type = 'bump';
      component.paymentError = null;
      fixture.detectChanges();
    });
    it('should show button', () => {
      const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;

      expect(button.textContent).toEqual(
        $localize`:@@highlight_item_view_pro_user_purchase_summary_highlight_button_web_specific:Highlight`
      );
    });
    it('should show primary button', () => {
      const button: HTMLElement = fixture.debugElement.query(By.css('button')).nativeElement;

      expect(button.className).toEqual('btn btn--big btn-primary btn-primary--bold mt-3');
    });
    describe('And click button', () => {
      describe('and is loading', () => {
        beforeEach(() => {
          component.loading = true;
          component.type = 'bump';

          fixture.detectChanges();
        });
        it('should be disabled', () => {
          spyOn(component, 'onSubmit').and.callThrough();
          const buttonDisabled = fixture.debugElement.query(By.css('button[disabled]'));

          expect(buttonDisabled).toBeTruthy();
        });
      });
      describe('and is not loading', () => {
        beforeEach(() => {
          component.loading = false;
          component.type = 'bump';
          fixture.detectChanges();
        });
        it('should emit click', fakeAsync(() => {
          spyOn(component.stripeCardToken, 'emit').and.callThrough();
          const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;

          button.click();
          tick();
          fixture.detectChanges();

          expect(component.stripeCardToken.emit).toHaveBeenCalledTimes(1);
          expect(component.stripeCardToken.emit).toHaveBeenCalledWith('123');
        }));
        it('should not be disabled', () => {
          spyOn(component, 'onSubmit').and.callThrough();
          const buttonDisabled = fixture.debugElement.query(By.css('button[disabled]'));

          expect(buttonDisabled).toBeFalsy();
        });
      });
    });
  });
});
