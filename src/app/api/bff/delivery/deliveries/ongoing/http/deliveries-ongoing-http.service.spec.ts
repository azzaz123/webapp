import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_DELIVERIES_ONGOING_AS_BUYER_DTO_RESPONSE } from '@api/fixtures/bff/delivery/deliveries/ongoing/deliveries-ongoing-as-buyer.fixtures.spec';
import { MOCK_DELIVERIES_ONGOING_AS_SELLER_DTO_RESPONSE } from '@api/fixtures/bff/delivery/deliveries/ongoing/deliveries-ongoing-as-seller.fixtures.spec';
import { DeliveriesOngoingAsBuyerDto, DeliveriesOngoingAsSellerDto } from '../dtos';

import { DeliveriesOngoingHttpService } from './deliveries-ongoing-http.service';
import { DELIVERY_ONGOING_AS_BUYER_ENDPOINT, DELIVERY_ONGOING_AS_SELLER_ENDPOINT } from './endpoints';

describe('DeliveriesOngoingHttpService', () => {
  let service: DeliveriesOngoingHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveriesOngoingHttpService],
    });
    service = TestBed.inject(DeliveriesOngoingHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the deliveries ongoing as buyer', () => {
    it('should get the deliveries ongoing as buyer', () => {
      let response: DeliveriesOngoingAsBuyerDto;

      service.getAsBuyer().subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(DELIVERY_ONGOING_AS_BUYER_ENDPOINT);
      req.flush(MOCK_DELIVERIES_ONGOING_AS_BUYER_DTO_RESPONSE);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_DELIVERIES_ONGOING_AS_BUYER_DTO_RESPONSE);
    });
  });

  describe('when asking to get the deliveries ongoing as seller', () => {
    it('should get the deliveries ongoing as seller', () => {
      let response: DeliveriesOngoingAsSellerDto;

      service.getAsSeller().subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(DELIVERY_ONGOING_AS_SELLER_ENDPOINT);
      req.flush(MOCK_DELIVERIES_ONGOING_AS_SELLER_DTO_RESPONSE);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_DELIVERIES_ONGOING_AS_SELLER_DTO_RESPONSE);
    });
  });
});
