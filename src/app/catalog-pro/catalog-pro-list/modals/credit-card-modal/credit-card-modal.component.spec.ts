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
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { I18nService } from '../../../../core/i18n/i18n.service';
import { UUID } from 'angular2-uuid/index';
import { Observable } from 'rxjs';

describe('CreditCardModalComponent', () => {
  let component: CreditCardModalComponent;
  let fixture: ComponentFixture<CreditCardModalComponent>;
  let stripeService: StripeService;
  let eventService: EventService;
  let errorService: ErrorsService;
  let toastrService: ToastrService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [
        NgbActiveModal,
        EventService,
        ErrorsService,
        {
          provide: ToastrService, useValue: {
            error() {
            },
            success() {
            }
        }
        },
        {
          provide: StripeService, useValue: {
            buy() {}
          }
        },
        {
          provide: Router, useValue: {
            navigate() {
            }
          }
        },
        {
          provide: I18nService, useValue: {
            getTranslations() {
            }
          }
        }
      ],
      declarations: [CreditCardModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardModalComponent);
    stripeService = TestBed.get(StripeService);
    eventService = TestBed.get(EventService);
    errorService = TestBed.get(ErrorsService);
    toastrService = TestBed.get(ToastrService);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.financialCard = FINANCIAL_CARD;
    fixture.detectChanges();
  });

  describe('hasStripeCard', () => {
    it('should set if stripeCard is present', () => {
      component.hasStripeCard(true);

      expect(component.isStripeCard).toBe(true);
    });

    it('should not call addNewCard if stripe card exists', () => {
      spyOn(component, 'addNewCard').and.callThrough();

      component.hasStripeCard(true);

      expect(component.addNewCard).not.toHaveBeenCalled();
    });

    it('should call addNewCard if stripe card does not exist', () => {
      spyOn(component, 'addNewCard').and.callThrough();

      component.hasStripeCard(false);

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
      spyOn(UUID, 'UUID').and.returnValue('1-2-3');
      component.savedCard = false;

      component.checkout(orderId);

      expect(stripeService.buy).toHaveBeenCalledWith(orderId, paymentId, component.isStripeCard, component.savedCard, component.card);
    });
  });
});
