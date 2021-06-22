import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { mockCreditCard, mockCreditCardSyncRequest, mockPaymentsCreditCard } from '@api/fixtures/payments/cards/credit-card.fixtures.spec';
import { of } from 'rxjs';
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
    beforeEach(() => {
      spyOn(paymentsHttpService, 'create').and.returnValue(of({}));
    });

    it('should ask to create a card', () => {
      service.create(mockCreditCardSyncRequest).subscribe();

      expect(paymentsHttpService.create).toHaveBeenCalledWith(mockCreditCardSyncRequest);
    });
  });

  describe('when asking to update a card', () => {
    beforeEach(() => {
      spyOn(paymentsHttpService, 'update').and.returnValue(of({}));
    });

    it('should ask to update a card', () => {
      service.update(mockCreditCardSyncRequest).subscribe();

      expect(paymentsHttpService.update).toHaveBeenCalledWith(mockCreditCardSyncRequest);
    });
  });

  describe('when asking to delete the user card', () => {
    beforeEach(() => {
      spyOn(paymentsHttpService, 'delete').and.returnValue(of({}));
    });

    it('should ask to delete the card', () => {
      service.delete().subscribe();

      expect(paymentsHttpService.delete).toHaveBeenCalled();
    });
  });
});
