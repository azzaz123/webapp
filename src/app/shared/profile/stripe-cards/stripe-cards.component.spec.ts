import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FINANCIAL_STRIPE_CARD } from '../../../../tests/payments.fixtures.spec';
import { I18nService } from '../../../core/i18n/i18n.service';
import { StripeCardsComponent } from './stripe-cards.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from '../../../core/errors/errors.service';
import {
  createFinancialCardFixture,
  createFavoriteFinancialCardFixture
} from '../../../../tests/stripe.fixtures.spec';

describe('StripeCardsComponent', () => {
  let component: StripeCardsComponent;
  let fixture: ComponentFixture<StripeCardsComponent>;
  let stripeService: StripeService;
  let modalService: NgbModal;
  let errorService: ErrorsService;
  let modalSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [StripeCardsComponent],
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
              return Observable.of([FINANCIAL_STRIPE_CARD]);
            },
            addNewCard() {
              return Observable.of({})
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
  });

  describe('ngOnInit', () => {
    it('should get and set financial card', () => {
      spyOn(stripeService, 'getCards').and.returnValue(Observable.of([FINANCIAL_STRIPE_CARD]));

      component.ngOnInit();

      expect(component.stripeCards.length).toBe(1);
    });

    it('should show error if getCards returns an error', () => {
      spyOn(stripeService, 'getCards').and.returnValue(Observable.throw(''));
      spyOn(errorService, 'i18nError');

      component.ngOnInit();

      expect(errorService.i18nError).toHaveBeenCalledWith('getStripeCardsError');
    });
  });

  describe('onDeleteCard', () => {
    it('should delete the card', () => {
      component.onDeleteCard(createFavoriteFinancialCardFixture());

      expect(component.stripeCards.length).toBe(0);
    });

  });

  describe('onAddNewCard', () => {
    beforeEach(fakeAsync(() => {
      spyOn(component, 'addNewCard').and.callThrough();
      spyOn(stripeService, 'addNewCard').and.callThrough();
      modalSpy = spyOn(modalService, 'open').and.callThrough();
      component.stripeCards[0] = createFinancialCardFixture();
    }));

    it('should add card if it is new', fakeAsync(() => {
      modalSpy.and.returnValue({
        result: Promise.resolve(FINANCIAL_STRIPE_CARD)
      });

      component.addNewCard();
      tick();

      expect(component.stripeCards.length).toBe(2);
    }));

    it('should not add card if card already exists', () => {
      component.addNewCard();

      expect(stripeService.addNewCard).not.toHaveBeenCalled();
      expect(component.stripeCards.length).toBe(1);
    });

  });

});
