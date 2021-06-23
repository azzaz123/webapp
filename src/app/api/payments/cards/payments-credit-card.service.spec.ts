import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CardOwnerNameIsInvalidError, PaymentsCardsError } from '@api/core/errors/payments/cards';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { mockCreditCard, mockCreditCardSyncRequest, mockPaymentsCreditCard } from '@api/fixtures/payments/cards/credit-card.fixtures.spec';
import {
  MOCK_PAYMENTS_CARDS_ERROR_CARD_OWNER_NAME_IS_INVALID_RESPONSE,
  MOCK_PAYMENTS_CARDS_UNKNWON_ERROR_RESPONSE,
} from '@api/fixtures/payments/cards/payments-cards-errors.fixtures.spec';
import { of, throwError } from 'rxjs';
import { PaymentsCreditCardHttpService } from './http/payments-credit-card-http.service';

import { PaymentsCreditCardService } from './payments-credit-card.service';

describe('PaymentsCreditCardService', () => {
  let service: PaymentsCreditCardService;
  let paymentsHttpService: PaymentsCreditCardHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentsCreditCardService, PaymentsCreditCardHttpService],
    });
    service = TestBed.inject(PaymentsCreditCardService);
    paymentsHttpService = TestBed.inject(PaymentsCreditCardHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get user cards', () => {
    beforeEach(() => {
      spyOn(paymentsHttpService, 'get').and.returnValue(of(mockPaymentsCreditCard));
    });

    it('should ask to get user cards', () => {
      service.get().subscribe();

      expect(paymentsHttpService.get).toHaveBeenCalled();
    });

    it('should map server response to web context', () => {
      let response: CreditCard;

      service.get().subscribe((data) => (response = data));

      expect(response).toEqual(mockCreditCard);
    });
  });

  describe('when asking to create a card', () => {
    describe('and when there are no errors in server', () => {
      beforeEach(() => {
        spyOn(paymentsHttpService, 'create').and.returnValue(of({}));
      });

      it('should ask to create a card', () => {
        service.create(mockCreditCardSyncRequest).subscribe();

        expect(paymentsHttpService.create).toHaveBeenCalledWith(mockCreditCardSyncRequest);
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
        spyOn(paymentsHttpService, 'update').and.returnValue(of({}));
      });

      it('should ask to update a card', () => {
        service.update(mockCreditCardSyncRequest).subscribe();

        expect(paymentsHttpService.update).toHaveBeenCalledWith(mockCreditCardSyncRequest);
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
      });

      it('should ask to delete the card', () => {
        service.delete().subscribe();

        expect(paymentsHttpService.delete).toHaveBeenCalled();
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
