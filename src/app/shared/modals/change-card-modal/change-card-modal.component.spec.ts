import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeCardModalComponent } from './change-card-modal.component';
import { StripeService } from 'app/core/stripe/stripe.service';
import { STRIPE_CARD_OPTION } from '../../../../tests/stripe.fixtures.spec';
import { FINANCIAL_CARD, FINANCIAL_STRIPE_CARD, SETUP_INTENT_DATA } from '../../../../tests/payments.fixtures.spec';
import { EventService } from 'app/core/event/event.service';
import { MODAL_ACTION } from '../pro-modal/pro-modal.interface';
import { ProModalComponent } from '../pro-modal/pro-modal.component';
import { modalConfig, PRO_MODAL_TYPE } from '../pro-modal/pro-modal.constants';

describe('ChangeCardModalComponent', () => {
  let component: ChangeCardModalComponent;
  let fixture: ComponentFixture<ChangeCardModalComponent>;
  let activeModal: NgbActiveModal;
  let stripeService: StripeService;
  let modalService: NgbModal;
  let componentInstance: any = {};
  let modalSpy: jasmine.Spy;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ChangeCardModalComponent],
        providers: [
          EventService,
          {
            provide: NgbActiveModal,
            useValue: {
              close() {},
              dismiss() {},
            },
          },
          {
            provide: StripeService,
            useValue: {
              setDefaultCard() {
                return of(FINANCIAL_STRIPE_CARD);
              },
              getCards() {
                return of([FINANCIAL_CARD]);
              },
              getSetupIntent() {
                return of({});
              },
              createDefaultCard() {
                return Promise.resolve(SETUP_INTENT_DATA);
              },
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeCardModalComponent);
    component = fixture.componentInstance;
    stripeService = TestBed.inject(StripeService);
    fixture.detectChanges();
    activeModal = TestBed.inject(NgbActiveModal);
    modalService = TestBed.inject(NgbModal);
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
    let paymentIntent = { payment_method: 'aaaabbbb3333' };
    it('should call setDefaultCard with paymentMethod', () => {
      spyOn(component, 'setDefaultCard').and.callThrough();

      component.setNewDefaultCard(paymentIntent);

      expect(component.setDefaultCard).toHaveBeenCalledWith(paymentIntent.payment_method);
    });

    it('should call setDefaultCard', () => {
      spyOn(stripeService, 'getCards').and.callThrough();
      spyOn(component, 'setDefaultCard').and.callThrough();

      component.setNewDefaultCard(paymentIntent);

      expect(component.setDefaultCard).toHaveBeenCalledWith(paymentIntent.payment_method);
    });
  });

  describe('change card', () => {
    beforeEach(() => {
      modalSpy = spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve(MODAL_ACTION.PRIMARY_BUTTON), componentInstance });
      component.selectedCard = true;
      component.card = FINANCIAL_STRIPE_CARD;
      component['modalRef'] = <any>{
        componentInstance: componentInstance,
      };
      spyOn(stripeService, 'getSetupIntent').and.callThrough();
      spyOn(stripeService, 'createDefaultCard').and.callThrough();
    });

    it('should show confirm modal', () => {
      component.setExistingDefaultCard();

      expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
        windowClass: 'pro-modal',
      });
      expect(component['modalRef'].componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.confirm_change_card]);
      expect(component['modalRef'].componentInstance.modalConfig.text1).toContain(FINANCIAL_STRIPE_CARD.stripeCard.last4);
    });

    describe('and click primary button', () => {
      it('should call service', fakeAsync(() => {
        component.setExistingDefaultCard();

        tick();

        expect(stripeService.getSetupIntent).toBeCalledTimes(1);
        expect(stripeService.getSetupIntent).toBeCalledWith();
        expect(stripeService.createDefaultCard).toBeCalledTimes(1);
        expect(stripeService.createDefaultCard).toBeCalledWith(undefined, component.card.id);
      }));
    });
    describe('and not click primary button', () => {
      beforeEach(() => {
        modalSpy.and.returnValue({ result: Promise.reject('error'), componentInstance });
      });
      it('should not call service', fakeAsync(() => {
        component.setExistingDefaultCard();

        tick();

        expect(stripeService.getSetupIntent).not.toHaveBeenCalled();
        expect(stripeService.createDefaultCard).not.toHaveBeenCalled();
      }));
    });
  });
});
