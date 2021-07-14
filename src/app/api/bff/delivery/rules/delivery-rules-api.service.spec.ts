import { HttpTestingController, HttpClientTestingModule, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  mappedFallbackShippingRulesFixture,
  mappedShippingRulesFixture,
  shippingRulesResponseFixture,
} from '@api/fixtures/bff/delivery/rules/shipping-rules.fixtures';
import { FavouritesApiService } from '@public/core/services/api/favourites/favourites-api.service';
import { DeliveryRulesApiService } from './delivery-rules-api.service';
import { SHIPPING_RULES_ENDPOINT } from './endpoints';
import { ShippingRules } from './dtos/shipping-rules';

describe('DeliveryRulesApiService', () => {
  let service: DeliveryRulesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryRulesApiService, FavouritesApiService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DeliveryRulesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asked to retrieve delivery-rules rules', () => {
    it('should return domain formatted shipping rules', () => {
      let response: ShippingRules;

      service.getRules().subscribe((data: ShippingRules) => {
        response = data;
      });

      const shippingRulesRequest: TestRequest = httpMock.expectOne(SHIPPING_RULES_ENDPOINT);
      shippingRulesRequest.flush(shippingRulesResponseFixture);

      expect(response).toEqual(mappedShippingRulesFixture);
      expect(shippingRulesRequest.request.url).toEqual(SHIPPING_RULES_ENDPOINT);
      expect(shippingRulesRequest.request.method).toBe('GET');
    });

    describe('and fails', () => {
      it('should return domain formatted fallback shipping rules', () => {
        let response: ShippingRules;

        service.getRules().subscribe((data: ShippingRules) => {
          response = data;
        });

        const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
        const shippingRulesRequest: TestRequest = httpMock.expectOne(SHIPPING_RULES_ENDPOINT);
        shippingRulesRequest.flush(shippingRulesResponseFixture, mockErrorResponse);

        expect(response).toEqual(mappedFallbackShippingRulesFixture);
        expect(shippingRulesRequest.request.url).toEqual(SHIPPING_RULES_ENDPOINT);
        expect(shippingRulesRequest.request.method).toBe('GET');
      });
    });
  });
});
