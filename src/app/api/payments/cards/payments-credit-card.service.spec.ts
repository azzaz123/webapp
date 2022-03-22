import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { CardInvalidError, CardOwnerNameIsInvalidError, PaymentsCardsError } from '@api/core/errors/payments/cards';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import {
  mockCreditCard,
  mockCreditCardSyncRequest,
  mockInvalidPaymentsCreditCard,
  mockPaymentsCreditCard,
} from '@api/fixtures/payments/cards/credit-card.fixtures.spec';
import {
  MOCK_PAYMENTS_CARDS_ERROR_CARD_OWNER_NAME_IS_INVALID_RESPONSE,
  MOCK_PAYMENTS_CARDS_UNKNWON_ERROR_RESPONSE,
} from '@api/fixtures/payments/cards/payments-cards-errors.fixtures.spec';
import { of, throwError } from 'rxjs';
import { PaymentsCreditCardHttpService } from './http/payments-credit-card-http.service';

import { PaymentsCreditCardService } from './payments-credit-card.service';
import { ThreeDomainSecureService } from './three-domain-secure/three-domain-secure.service';

describe('PaymentsCreditCardService', () => {
  let service: PaymentsCreditCardService;
  let paymentsHttpService: PaymentsCreditCardHttpService;
  let threeDomainSecureService: ThreeDomainSecureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PaymentsCreditCardService,
        PaymentsCreditCardHttpService,
        {
          provide: ThreeDomainSecureService,
          useValue: { checkThreeDomainSecure: () => of(true), cardNeedsToBeRemoved: () => true },
        },
      ],
    });
    service = TestBed.inject(PaymentsCreditCardService);
    paymentsHttpService = TestBed.inject(PaymentsCreditCardHttpService);
    threeDomainSecureService = TestBed.inject(ThreeDomainSecureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get user cards', () => {
    it('should ask to get user cards', fakeAsync(() => {
      spyOn(paymentsHttpService, 'get').and.callThrough();

      service.get().subscribe();
      tick();

      expect(paymentsHttpService.get).toHaveBeenCalled();
    }));

    describe('and card is valid', () => {
      beforeEach(() => {
        spyOn(paymentsHttpService, 'get').and.returnValue(of(mockPaymentsCreditCard));
        spyOn(threeDomainSecureService, 'cardNeedsToBeRemoved').and.returnValue(false);
      });

      it('should map server response to web context', fakeAsync(() => {
        let response: CreditCard;

        service.get().subscribe((data) => (response = data));
        tick();

        expect(response).toEqual(mockCreditCard);
      }));

      it('should update the reactive credit card', fakeAsync(() => {
        let response: CreditCard;

        service.get().subscribe();
        service.creditCard$.subscribe((data) => (response = data));
        tick();

        expect(response).toEqual(mockCreditCard);
      }));
    });

    describe('and when card is invalid', () => {
      beforeEach(() => {
        spyOn(paymentsHttpService, 'get').and.returnValue(of(mockInvalidPaymentsCreditCard));
        spyOn(paymentsHttpService, 'delete').and.returnValue(of(null));
        spyOn(threeDomainSecureService, 'cardNeedsToBeRemoved').and.returnValue(true);
      });

      it('should set credit card as it does not exist', fakeAsync(() => {
        let methodResponse: CreditCard;
        let observableResponse: CreditCard;

        service.get().subscribe({ next: (data) => (methodResponse = data), error: () => {} });
        service.creditCard$.subscribe({ next: (data) => (observableResponse = data), error: () => {} });
        tick();

        expect(methodResponse).toBeFalsy();
        expect(observableResponse).toBeFalsy();
      }));

      it('should ask for card deletion', fakeAsync(() => {
        service.get().subscribe({ error: () => {} });
        tick();

        expect(paymentsHttpService.delete).toHaveBeenCalledTimes(1);
      }));

      it('should notify there was an error with the card', fakeAsync(() => {
        let methodResultError: CardInvalidError;

        service.get().subscribe({ error: (e) => (methodResultError = e) });
        tick();

        expect(methodResultError instanceof CardInvalidError).toBe(true);
      }));
    });

    describe('AND WHEN card service return an error', () => {
      const fakeError: Error = new Error('The server is broken');

      beforeEach(() => {
        spyOn(paymentsHttpService, 'get').and.returnValue(throwError(fakeError));
      });

      it('should propagete the error', fakeAsync(() => {
        let methodResponse;
        let errorResponse;

        service.get(false).subscribe({
          next: (data) => (methodResponse = data),
          error: (error) => {
            errorResponse = error;
          },
        });

        tick();

        expect(methodResponse).toBeFalsy();
        expect(errorResponse).toEqual(fakeError);
      }));
    });
  });

  describe('when asking to create a card', () => {
    describe('and when there are no errors in server', () => {
      beforeEach(() => {
        spyOn(service, 'get');
        spyOn(paymentsHttpService, 'create').and.returnValue(of({}));

        service.create(mockCreditCardSyncRequest).subscribe();
      });

      it('should ask to create a card', () => {
        expect(paymentsHttpService.create).toHaveBeenCalledWith(mockCreditCardSyncRequest);
      });

      it('should get the credit card', () => {
        expect(service.get).toHaveBeenCalled();
      });
    });

    describe('and when receiving an error from server', () => {
      describe('and when the error is an unknown error', () => {
        beforeEach(() => {
          spyOn(paymentsHttpService, 'create').and.returnValue(throwError(MOCK_PAYMENTS_CARDS_UNKNWON_ERROR_RESPONSE));
        });

        it('should map the error', () => {
          let response: PaymentsCardsError[];

          service.create(mockCreditCardSyncRequest).subscribe({
            error: (errorResponse: PaymentsCardsError[]) => (response = errorResponse),
          });

          expect(response[0] instanceof Error).toBe(true);
        });
      });

      describe('and when the error is a known error', () => {
        beforeEach(() => {
          spyOn(paymentsHttpService, 'create').and.returnValue(throwError(MOCK_PAYMENTS_CARDS_ERROR_CARD_OWNER_NAME_IS_INVALID_RESPONSE));
        });

        it('should map the error', () => {
          let response: PaymentsCardsError[];

          service.create(mockCreditCardSyncRequest).subscribe({
            error: (errorResponse: PaymentsCardsError[]) => (response = errorResponse),
          });

          expect(response[0] instanceof CardOwnerNameIsInvalidError).toBe(true);
        });
      });
    });
  });

  describe('when asking to update a card', () => {
    describe('and when there are no errors in server', () => {
      beforeEach(() => {
        spyOn(service, 'get');
        spyOn(paymentsHttpService, 'update').and.returnValue(of({}));

        service.update(mockCreditCardSyncRequest).subscribe();
      });

      it('should ask to update a card', () => {
        expect(paymentsHttpService.update).toHaveBeenCalledWith(mockCreditCardSyncRequest);
      });

      it('should get the credit card', () => {
        expect(service.get).toHaveBeenCalled();
      });
    });

    describe('and when receiving an error from server', () => {
      describe('and when the error is an unknown error', () => {
        beforeEach(() => {
          spyOn(paymentsHttpService, 'update').and.returnValue(throwError(MOCK_PAYMENTS_CARDS_UNKNWON_ERROR_RESPONSE));
        });

        it('should map the error', () => {
          let response: PaymentsCardsError[];

          service.update(mockCreditCardSyncRequest).subscribe({
            error: (errorResponse: PaymentsCardsError[]) => (response = errorResponse),
          });

          expect(response[0] instanceof Error).toBe(true);
        });
      });

      describe('and when the error is a known error', () => {
        beforeEach(() => {
          spyOn(paymentsHttpService, 'update').and.returnValue(throwError(MOCK_PAYMENTS_CARDS_ERROR_CARD_OWNER_NAME_IS_INVALID_RESPONSE));
        });

        it('should map the error', () => {
          let response: PaymentsCardsError[];

          service.update(mockCreditCardSyncRequest).subscribe({
            error: (errorResponse: PaymentsCardsError[]) => (response = errorResponse),
          });

          expect(response[0] instanceof CardOwnerNameIsInvalidError).toBe(true);
        });
      });
    });
  });

  describe('when asking to delete the user card', () => {
    describe('and when there are no errors in server', () => {
      beforeEach(() => {
        spyOn(paymentsHttpService, 'delete').and.returnValue(of({}));

        service.delete().subscribe();
      });

      it('should ask to delete the card', () => {
        expect(paymentsHttpService.delete).toHaveBeenCalled();
      });

      it('should update the credit card subject', () => {
        let result: CreditCard;

        service.creditCard$.subscribe((creditCard: CreditCard) => (result = creditCard));

        expect(result).toBe(null);
      });
    });

    describe('and when receiving an error from server', () => {
      describe('and when the error is an unknown error', () => {
        beforeEach(() => {
          spyOn(paymentsHttpService, 'delete').and.returnValue(throwError(MOCK_PAYMENTS_CARDS_UNKNWON_ERROR_RESPONSE));
        });

        it('should map the error', () => {
          let response: PaymentsCardsError[];

          service.delete().subscribe({
            error: (errorResponse: PaymentsCardsError[]) => (response = errorResponse),
          });

          expect(response[0] instanceof Error).toBe(true);
        });
      });

      describe('and when the error is a known error', () => {
        beforeEach(() => {
          spyOn(paymentsHttpService, 'delete').and.returnValue(throwError(MOCK_PAYMENTS_CARDS_ERROR_CARD_OWNER_NAME_IS_INVALID_RESPONSE));
        });

        it('should map the error', () => {
          let response: PaymentsCardsError[];

          service.delete().subscribe({
            error: (errorResponse: PaymentsCardsError[]) => (response = errorResponse),
          });

          expect(response[0] instanceof CardOwnerNameIsInvalidError).toBe(true);
        });
      });
    });
  });
});
