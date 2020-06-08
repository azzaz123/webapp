
import { throwError as observableThrowError, of } from 'rxjs';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FINANCIAL_STRIPE_CARD } from '../../../../tests/payments.fixtures.spec';
import { I18nService } from '../../../core/i18n/i18n.service';
import { StripeCardsComponent } from './stripe-cards.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from '../../../core/errors/errors.service';
import {
  createFinancialCardFixture,
  createFavoriteFinancialCardFixture
} from '../../../../tests/stripe.fixtures.spec';
import { delay } from 'rxjs/operators';
import { ButtonComponent } from '../../button/button.component';
import { NewCardModalComponent } from 'app/shared/modals/new-card-modal/new-card-modal.component';
import { SubscriptionsService } from 'app/core/subscriptions/subscriptions.service';
import { MAPPED_SUBSCRIPTIONS } from '../../../../tests/subscriptions.fixtures.spec';

describe('StripeCardsComponent', () => {
  let component: StripeCardsComponent;
  let fixture: ComponentFixture<StripeCardsComponent>;
  let stripeService: StripeService;
  let modalService: NgbModal;
  let errorService: ErrorsService;
  let modalSpy: jasmine.Spy;
  let activeModal: NgbActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [StripeCardsComponent, ButtonComponent],
        providers: [
          I18nService,
          {
            provide: ErrorsService, useValue: {
            show() {
            },
            i18nError() {
            }
          }
          },
          {
            provide: StripeService, useValue: {
              getCards() {
                return of([FINANCIAL_STRIPE_CARD]);
              },
              addNewCard() {
                return of({})
              }
            }
          },
          {
            provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(FINANCIAL_STRIPE_CARD)
              };
            }
          }
          },
          {
            provide: SubscriptionsService, useValue: {
              getSubscriptions() {
                return of(MAPPED_SUBSCRIPTIONS);
              }
            }
          },
          {
            provide: NgbActiveModal, useValue: {
              close() {
              },
              dismiss() {
              }
            }
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    stripeService = TestBed.get(StripeService);
    modalService = TestBed.get(NgbModal);
    errorService = TestBed.get(ErrorsService);
    activeModal = TestBed.get(NgbActiveModal);
  });

  describe('ngOnInit', () => {
    it('should get and set financial card', () => {
      spyOn(stripeService, 'getCards').and.returnValue(of([FINANCIAL_STRIPE_CARD]));

      component.ngOnInit();

      expect(component.stripeCards.length).toBe(1);
    });

    it('should show error if getCards returns an error', () => {
      spyOn(stripeService, 'getCards').and.returnValue(observableThrowError(''));
      spyOn(errorService, 'i18nError');

      component.ngOnInit();

      expect(errorService.i18nError).toHaveBeenCalledWith('getStripeCardsError');
    });
  });


  describe('onDeleteCard', () => {
    it('should call getCards service and set the cards', () => {
      spyOn(stripeService, 'getCards').and.callThrough();

      component.onDeleteCard();

      expect(stripeService.getCards).toHaveBeenCalledWith(false);
    });
  });

  describe('onSetChangeCard', () => {
    it('should call addNewSubscriptionCard', () => {
      spyOn(component, 'addNewSubscriptionCard').and.callThrough();

      component.onSetChangeCard('e');

      expect(component.addNewSubscriptionCard).toHaveBeenCalled();
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
        result: Promise.resolve(FINANCIAL_STRIPE_CARD)
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

      const loadingComponent: HTMLElement = fixture.nativeElement.querySelector('tsl-button > button > mat-icon');
      expect(loadingComponent).toBeFalsy();
      expect(modalService.open).toHaveBeenCalledWith(NewCardModalComponent, {
        windowClass: 'review'
      });
    }));

  });

});
