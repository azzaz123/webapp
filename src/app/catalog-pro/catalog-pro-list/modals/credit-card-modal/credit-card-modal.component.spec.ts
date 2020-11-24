import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardModalComponent } from './credit-card-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FINANCIAL_CARD } from '../../../../../tests/payments.fixtures.spec';
import { STRIPE_CARD_OPTION } from '../../../../../tests/stripe.fixtures.spec';
import { StripeService } from '../../../../core/stripe/stripe.service';
import { EventService } from '../../../../core/event/event.service';
import { ErrorsService } from '../../../../core/errors/errors.service';
import { ToastService } from '../../../../layout/toast/toast.service';
import { Router } from '@angular/router';
import { I18nService } from '../../../../core/i18n/i18n.service';
import { UuidService } from '../../../../core/uuid/uuid.service';

describe('CreditCardModalComponent', () => {
  let component: CreditCardModalComponent;
  let fixture: ComponentFixture<CreditCardModalComponent>;
  let stripeService: StripeService;
  let eventService: EventService;
  let errorService: ErrorsService;
  let toastService: ToastService;
  let router: Router;
  let uuidService: UuidService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [
        NgbActiveModal,
        EventService,
        ErrorsService,
        {
          provide: StripeService,
          useValue: {
            buy() {},
          },
        },
        {
          provide: Router,
          useValue: {
            navigate() {},
          },
        },
        {
          provide: I18nService,
          useValue: {
            getTranslations() {},
          },
        },
      ],
      declarations: [CreditCardModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardModalComponent);
    stripeService = TestBed.inject(StripeService);
    eventService = TestBed.inject(EventService);
    errorService = TestBed.inject(ErrorsService);
    toastService = TestBed.inject(ToastService);
    uuidService = TestBed.inject(UuidService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    component.financialCard = FINANCIAL_CARD;
    fixture.detectChanges();
  });

  describe('hasCard', () => {
    it('should set if stripeCard is present', () => {
      component.hasCard(true);

      expect(component.hasSavedCard).toBe(true);
    });

    it('should not call addNewCard if stripe card exists', () => {
      spyOn(component, 'addNewCard').and.callThrough();

      component.hasCard(true);

      expect(component.addNewCard).not.toHaveBeenCalled();
    });

    it('should call addNewCard if stripe card does not exist', () => {
      spyOn(component, 'addNewCard').and.callThrough();

      component.hasCard(false);

      expect(component.addNewCard).toHaveBeenCalledTimes(1);
    });
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
    it('should call stripeService', () => {
      spyOn(stripeService, 'buy').and.callThrough();
      const orderId = 'UUID';
      const paymentId = '1-2-3';
      spyOn(uuidService, 'getUUID').and.returnValue('1-2-3');
      component.savedCard = false;

      component.checkout(orderId);

      expect(stripeService.buy).toHaveBeenCalledWith(
        orderId,
        paymentId,
        component.hasSavedCard,
        component.savedCard,
        component.card
      );
    });
  });
});
