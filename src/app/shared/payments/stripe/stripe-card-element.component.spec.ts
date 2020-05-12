import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PAYMENT_METHOD_CARD_RESPONSE } from '../../../../tests/payments.fixtures.spec';
import { StripeCardElementComponent } from './stripe-card-element.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';
import { ToastService } from '../../../layout/toast/toast.service';

describe('StripeCardElementComponent', () => {
  let component: StripeCardElementComponent;
  let fixture: ComponentFixture<StripeCardElementComponent>;
  let stripeService: StripeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [StripeCardElementComponent],
        imports:      [
          ReactiveFormsModule,
          FormsModule
        ],
        providers:    [
          I18nService,
          {
            provide: StripeService, useValue: {
              createStripeCard() {
                return Promise.resolve(PAYMENT_METHOD_CARD_RESPONSE[0]);
              },
              lib: {
                elements: () =>  {
                  return {
                    create: () => {
                      return {
                        mount: () => {},
                        addEventListener: () => {},
                        removeEventListener: (type: string, listener: any) => {},
                        destroy: () => {}
                      };
                    }
                  };
                }
              }
          }
          },
          {
            provide: ToastService, useValue: {
              show(){}
            }
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeCardElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    stripeService = TestBed.get(StripeService);
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
      spyOn(component.onStripeCardCreate, 'emit').and.callThrough();

      component.createNewCard();
      tick();

      expect(component.onStripeCardCreate.emit).toHaveBeenCalledWith(PAYMENT_METHOD_CARD_RESPONSE[0]);
    }));
  });

  describe('showUseSavedCard', () => {
    it('should emit onClickUseSavedCard true when clicking on element', () => {
      spyOn(component.onClickUseSavedCard, 'emit').and.callThrough();
      component.showUseSavedCard = true;
      component.type = 'subscription';
      fixture.detectChanges();
      const useSavedCardButton = fixture.debugElement.nativeElement.querySelector('.card-feedback__action');

      useSavedCardButton.click();

      expect(component.onClickUseSavedCard.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('when there is a payment error', () => {
    it('should show an error message', () => {
      component.isPaymentError = true;
      fixture.detectChanges();

      const stripeCardInput: HTMLElement = fixture.elementRef.nativeElement.querySelector('.StripeCard__error');
      expect(stripeCardInput).toBeTruthy();
    });
  });
});
