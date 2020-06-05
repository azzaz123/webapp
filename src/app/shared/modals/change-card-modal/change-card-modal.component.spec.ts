import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeCardModalComponent } from './change-card-modal.component';
import { StripeService } from 'app/core/stripe/stripe.service';
import { STRIPE_CARD_OPTION, STRIPE_CARD } from '../../../../tests/stripe.fixtures.spec';
import { FINANCIAL_CARD, FINANCIAL_STRIPE_CARD } from '../../../../tests/payments.fixtures.spec';
import { EventService } from 'app/core/event/event.service';

describe('ChangeCardModalComponent', () => {
  let component: ChangeCardModalComponent;
  let fixture: ComponentFixture<ChangeCardModalComponent>;
  let activeModal: NgbActiveModal;
  let stripeService: StripeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ChangeCardModalComponent],
        providers: [
          EventService,
          {
            provide: NgbActiveModal, useValue: {
              close() {
              },
              dismiss() {
              }
            }
          },
          {
            provide: StripeService, useValue: {
              setDefaultCard() {
                return of(FINANCIAL_STRIPE_CARD);
              },
              getCards() {
                return of([FINANCIAL_CARD]);
              }
            }
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeCardModalComponent);
    component = fixture.componentInstance;
    stripeService = TestBed.get(StripeService);
    fixture.detectChanges();
    activeModal = TestBed.get(NgbActiveModal);
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

  describe('addNewCard', () => {
    it('should set showCard and savedCard', () => {
      component.addNewCard();

      expect(component.showCard).toBe(true);
      expect(component.savedCard).toBe(false);
    });
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

  describe('setDefaultCard', () => {
    it('should call the service with setDefaultCard', () => {
      spyOn(stripeService, 'setDefaultCard').and.callThrough();
      spyOn(activeModal, 'close').and.callThrough();
      spyOn(component, 'setDefaultCard').and.callThrough();

      component.setDefaultCard('aaaabbbb3333');

      expect(stripeService.setDefaultCard).toHaveBeenCalledWith('aaaabbbb3333');
    });
  });

  describe('setNewDefaultCard', () => {
    let paymentIntent = {payment_method: 'aaaabbbb3333'};
    it('should get all cards', () => {
      spyOn(stripeService, 'getCards').and.callThrough();
      
      component.setNewDefaultCard(paymentIntent);

      expect(stripeService.getCards).toHaveBeenCalled();
    });

    it('should call setDefaultCard', () => {
      spyOn(stripeService, 'getCards').and.callThrough();
      //spyOn(stripeService, 'setDefaultCard').and.callThrough();
      spyOn(component, 'setDefaultCard').and.callThrough();

      component.setNewDefaultCard(paymentIntent);

      expect(component.setDefaultCard).toHaveBeenCalledWith(paymentIntent.payment_method);
    });
  });


});
