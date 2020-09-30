
import { throwError, of } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyWallacoinsModalComponent } from './buy-wallacoins-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '../../shared/pipes';
import { DecimalPipe } from '@angular/common';
import { ErrorsService } from '../../core/errors/errors.service';
import { PaymentService } from '../../core/payments/payment.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pack } from '../../core/payments/pack';
import { UUID } from 'angular2-uuid';
import { StripeService } from '../../core/stripe/stripe.service';
import { EventService } from '../../core/event/event.service';
import { STRIPE_CARD_OPTION } from '../../../tests/stripe.fixtures.spec';

describe('BuyWallacoinsModalComponent', () => {
  let component: BuyWallacoinsModalComponent;
  let fixture: ComponentFixture<BuyWallacoinsModalComponent>;
  let paymentService: PaymentService;
  let activeModal: NgbActiveModal;
  let errorService: ErrorsService;
  let stripeService: StripeService;
  let eventService: EventService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuyWallacoinsModalComponent, CustomCurrencyPipe],
      providers: [
        EventService,
        DecimalPipe,
        {
          provide: ErrorsService, useValue: {
            show() {
            },
            i18nError() {
            }
         }
        },
        {
          provide: PaymentService, useValue: {
            orderExtrasProPack() {
              return of({});
            }
          }
        },
        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
          }
        },
        {
          provide: StripeService, useValue: {
            getCards() {
              return of([]);
            },
            buy() {}
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyWallacoinsModalComponent);
    component = fixture.componentInstance;
    component.pack = new Pack(
      'id',
      100,
      100,
      'EUR',
      'wallacoins'
    );
    fixture.detectChanges();
    paymentService = TestBed.inject(PaymentService);
    activeModal = TestBed.inject(NgbActiveModal);
    errorService = TestBed.inject(ErrorsService);
    stripeService = TestBed.inject(StripeService);
    eventService = TestBed.inject(EventService);
  });

  describe('addNewCard', () => {
    it('should set showCard and savedCard', () => {
      component.addNewCard();

      expect(component.showCard).toBe(true);
      expect(component.savedCard).toBe(false);
    });
  });

  describe('removeNewCard', () => {
    it('should set showCard and savedCard', () => {
      component.removeNewCard();

      expect(component.showCard).toBe(false);
      expect(component.savedCard).toBe(true);
    });
  });

  describe('setSavedCard', () => {
    it('should set showCard and savedCard and call setCardInfo', () => {
      spyOn(component, 'setCardInfo').and.callThrough();
      component.setSavedCard(STRIPE_CARD_OPTION);

      expect(component.showCard).toBe(false);
      expect(component.savedCard).toBe(true);
      expect(component.selectedCard).toBe(true);
      expect(component.setCardInfo).toHaveBeenCalledWith(STRIPE_CARD_OPTION);
    });
  });

  describe('checkout', () => {
    let eventId: string;

    describe('already has billing info', () => {
      beforeEach(() => {
        spyOn(paymentService, 'orderExtrasProPack').and.callThrough();
        spyOn(UUID, 'UUID').and.returnValue('UUID');
        eventId = null;
      });

      it('should call paymentService orderExtrasProPack method to create a pack order', () => {
        component.checkout();

        expect(paymentService.orderExtrasProPack).toHaveBeenCalledWith({
          id: 'UUID',
          packs: ['id'],
          origin: 'WEB',
          provider: 'STRIPE'
        });
      });

      describe('error', () => {
        it('should call toastr', () => {
          paymentService.orderExtrasProPack = jasmine.createSpy().and.returnValue(throwError({
            text() {
              return '';
            }
          }));
          spyOn(errorService, 'i18nError');

          component.checkout();

          expect(errorService.i18nError).toHaveBeenCalledWith('packError');
        });
      });
    });
  });

  describe('getTrackingAttributes', () => {
    it('should return valid object when Stripe', () => {
      expect(component.getTrackingAttributes()).toEqual({ payment_method: 'STRIPE' });
    });

  });
});
