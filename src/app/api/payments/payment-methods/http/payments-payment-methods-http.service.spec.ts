import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MOCK_PAYMENTS_PAYMENT_METHODS_RESPONSE } from '@api/fixtures/payments/payment-methods/payments-payment-methods-dto.fixtures.spec';
import { PAYMENTS_PAYMENT_METHODS_ENDPOINT } from '@api/payments/payment-methods/http/endpoints';
import { PaymentsPaymentMethodsDto } from '@api/payments/payment-methods/dtos/payments-payment-methods-dto.interface';
import { PaymentsPaymentMethodsHttpService } from '@api/payments/payment-methods/http/payments-payment-methods-http.service';

describe('PaymentsPaymentMethodsHttpService', () => {
  let service: PaymentsPaymentMethodsHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentsPaymentMethodsHttpService],
    });
    service = TestBed.inject(PaymentsPaymentMethodsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the payment methods', () => {
    it('should get the corresponding information', () => {
      let response: PaymentsPaymentMethodsDto;

      service.getPaymentMethods().subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(PAYMENTS_PAYMENT_METHODS_ENDPOINT);
      req.flush(MOCK_PAYMENTS_PAYMENT_METHODS_RESPONSE);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_PAYMENTS_PAYMENT_METHODS_RESPONSE);
    });
  });
});
