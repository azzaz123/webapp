import { throwError, of } from 'rxjs';
import { fakeAsync, tick, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FINANCIAL_STRIPE_CARD } from '@fixtures/payments.fixtures.spec';
import { I18nService } from '../../../core/i18n/i18n.service';
import { StripeCardsComponent } from './stripe-cards.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from '../../../core/errors/errors.service';
import { createFinancialCardFixture, STRIPE_CARD_OPTION_SUBSCRIPTION, STRIPE_CARD_OPTION } from '@fixtures/stripe.fixtures.spec';
import { delay } from 'rxjs/operators';
import { ButtonComponent } from '../../button/button.component';
import { NewCardModalComponent } from 'app/shared/modals/new-card-modal/new-card-modal.component';
import { SubscriptionsService } from 'app/core/subscriptions/subscriptions.service';
import { SUBSCRIPTIONS } from '@fixtures/subscriptions.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { modalConfig, PRO_MODAL_TYPE } from '@shared/modals/pro-modal/pro-modal.constants';
import { MODAL_ACTION } from '@shared/modals/pro-modal/pro-modal.interface';

describe('StripeCardsComponent', () => {
  let component: StripeCardsComponent;
  let fixture: ComponentFixture<StripeCardsComponent>;
  let stripeService: StripeService;
  let modalService: NgbModal;
  let errorService: ErrorsService;
  let modalSpy: jasmine.Spy;
  let i18nService: I18nService;
  let subscriptionsService: SubscriptionsService;
  let componentInstance: any = {};
  let toastService: ToastService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StripeCardsComponent, ButtonComponent],
        providers: [
          I18nService,
          ToastService,
          {
            provide: ErrorsService,
            useValue: {
              show() {},
              i18nError() {},
            },
          },
          {
            provide: StripeService,
            useValue: {
              getCards() {
                return of([FINANCIAL_STRIPE_CARD]);
              },
              addNewCard() {
                return of({});
              },
              deleteCard() {
                return of();
              },
            },
          },
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  result: Promise.resolve(FINANCIAL_STRIPE_CARD),
                };
              },
            },
          },
          {
            provide: SubscriptionsService,
            useValue: {
              getSubscriptions() {
                return of(SUBSCRIPTIONS);
              },
            },
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    stripeService = TestBed.inject(StripeService);
    modalService = TestBed.inject(NgbModal);
    errorService = TestBed.inject(ErrorsService);
    i18nService = TestBed.inject(I18nService);
    toastService = TestBed.inject(ToastService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
  });

  describe('ngOnInit', () => {
    it('should get and set financial card', () => {
      spyOn(stripeService, 'getCards').and.returnValue(of([FINANCIAL_STRIPE_CARD]));

      component.ngOnInit();

      expect(component.stripeCards.length).toBe(1);
    });

    it('should show error if getCards returns an error', () => {
      spyOn(stripeService, 'getCards').and.returnValue(throwError(''));
      spyOn(errorService, 'i18nError');

      component.ngOnInit();

      expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.STRIPE_CARDS_RETRIEVAL_ERROR);
    });

    it('should call getSubscriptions service', () => {
      spyOn(subscriptionsService, 'getSubscriptions').and.callThrough();

      component.ngOnInit();

      expect(subscriptionsService.getSubscriptions).toHaveBeenCalledWith(false);
    });
  });

  describe('when we try to delete a default card...', () => {
    beforeEach(() => {
      spyOn(toastService, 'show');
      spyOn(errorService, 'i18nError');
      spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve(MODAL_ACTION.PRIMARY_BUTTON), componentInstance });
      spyOn(stripeService, 'getCards').and.returnValue(of([FINANCIAL_STRIPE_CARD]));
    });

    describe('and the delete petition succeed...', () => {
      beforeEach(() => {
        spyOn(stripeService, 'deleteCard').and.returnValue(of(null));
        component['modalRef'] = <any>{
          componentInstance: componentInstance,
        };
        component.openDeleteCardModal(STRIPE_CARD_OPTION_SUBSCRIPTION);
      });

      it('should open NoCardModalComponent modal', fakeAsync(() => {
        tick();

        expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
          windowClass: 'pro-modal',
        });

        expect(component['modalRef'].componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.remove_card]);
      }));

      it('should call deleteCard service action', fakeAsync(() => {
        tick();

        expect(stripeService.deleteCard).toHaveBeenCalledWith(STRIPE_CARD_OPTION_SUBSCRIPTION.id);
      }));

      it('should show a success toast', fakeAsync(() => {
        tick();

        expect(toastService.show).toHaveBeenCalledWith({
          title: i18nService.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CONTINUE_SUCCESS_TITLE),
          text: i18nService.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CARD_DELETED),
          type: TOAST_TYPES.SUCCESS,
        });
      }));

      it('should request all the cards again', fakeAsync(() => {
        tick();

        expect(stripeService.getCards).toHaveBeenCalledWith(false);
      }));
    });

    describe('and the delete petition fails...', () => {
      beforeEach(() => {
        spyOn(stripeService, 'deleteCard').and.returnValue(throwError('network error'));
        component['modalRef'] = <any>{
          componentInstance: componentInstance,
        };

        component.openDeleteCardModal(STRIPE_CARD_OPTION_SUBSCRIPTION);
      });

      it('should open NoCardModalComponent modal', fakeAsync(() => {
        tick();
        fixture.detectChanges();

        expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
          windowClass: 'pro-modal',
        });
        expect(component['modalRef'].componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.remove_card]);
      }));

      it('should call deleteCard service action', fakeAsync(() => {
        tick();

        expect(stripeService.deleteCard).toHaveBeenCalledWith(STRIPE_CARD_OPTION_SUBSCRIPTION.id);
      }));

      it('should show an error toast', fakeAsync(() => {
        tick();
        expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.PRO_SUBSCRIPTION_CARD_DELETED_ERROR);
      }));
    });
  });

  describe('when we try to delete a non default card...', () => {
    beforeEach(() => {
      spyOn(toastService, 'show');
      spyOn(errorService, 'i18nError');
      spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve(), componentInstance: {} });
      spyOn(stripeService, 'getCards').and.returnValue(of([FINANCIAL_STRIPE_CARD]));
    });

    describe('and the delete petition succeed...', () => {
      beforeEach(() => {
        spyOn(stripeService, 'deleteCard').and.returnValue(of(null));

        component.openDeleteCardModal(STRIPE_CARD_OPTION);
      });

      it('should open NoCardModalComponent modal', fakeAsync(() => {
        tick();

        expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
      }));

      it('should call deleteCard service action', fakeAsync(() => {
        tick();

        expect(stripeService.deleteCard).toHaveBeenCalledWith(STRIPE_CARD_OPTION.id);
      }));

      it('should show a success toast', fakeAsync(() => {
        tick();

        expect(toastService.show).toHaveBeenCalledWith({
          title: i18nService.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CONTINUE_SUCCESS_TITLE),
          text: i18nService.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CARD_DELETED),
          type: TOAST_TYPES.SUCCESS,
        });
      }));

      it('should request all the cards again', fakeAsync(() => {
        tick();

        expect(stripeService.getCards).toHaveBeenCalledWith(false);
      }));
    });

    describe('and the delete petition fails...', () => {
      beforeEach(() => {
        spyOn(stripeService, 'deleteCard').and.returnValue(throwError('network error'));

        component.openDeleteCardModal(STRIPE_CARD_OPTION);
      });

      it('should open ConfirmationModalComponent modal', fakeAsync(() => {
        tick();

        expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
      }));

      it('should call deleteCard service action', fakeAsync(() => {
        tick();

        expect(stripeService.deleteCard).toHaveBeenCalledWith(STRIPE_CARD_OPTION_SUBSCRIPTION.id);
      }));

      it('should show an error toast', fakeAsync(() => {
        tick();
        expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.PRO_SUBSCRIPTION_CARD_DELETED_ERROR);
      }));
    });
  });

  describe('addNewSubscriptionCard', () => {
    it('should open the ChangeCardModalComponent modal', fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(stripeService, 'getCards').and.callThrough();

      component.addNewSubscriptionCard();
      tick();

      expect(stripeService.getCards).toHaveBeenCalled();
    }));
  });

  describe('onAddNewCard', () => {
    beforeEach(fakeAsync(() => {
      modalSpy = spyOn(modalService, 'open').and.callThrough();
      component.stripeCards[0] = createFinancialCardFixture();
    }));

    it('should add card if it is new', fakeAsync(() => {
      spyOn(component, 'addNewCard').and.callThrough();
      spyOn(stripeService, 'addNewCard').and.callThrough();
      modalSpy.and.returnValue({
        result: Promise.resolve(FINANCIAL_STRIPE_CARD),
      });

      component.addNewCard();
      tick();

      expect(component.stripeCards.length).toBe(2);
    }));

    it('should not add card if card already exists', () => {
      spyOn(component, 'addNewCard').and.callThrough();
      spyOn(stripeService, 'addNewCard').and.callThrough();

      component.addNewCard();

      expect(stripeService.addNewCard).not.toHaveBeenCalled();
      expect(component.stripeCards.length).toBe(1);
    });

    it('should remove the loading component in the button content when backend answered', fakeAsync(() => {
      const backendResponseTimeMs = 3000;
      spyOn(component, 'addNewCard').and.callThrough();
      spyOn(stripeService, 'addNewCard').and.returnValue(of().pipe(delay(backendResponseTimeMs)));

      component.addNewCard();
      tick(backendResponseTimeMs + 1);
      fixture.detectChanges();

      const loadingComponent: HTMLElement = fixture.nativeElement.querySelector('tsl-button > button > tsl-svg-icon');
      expect(loadingComponent).toBeFalsy();
      expect(modalService.open).toHaveBeenCalledWith(NewCardModalComponent, {
        windowClass: 'review',
      });
    }));
  });
});
