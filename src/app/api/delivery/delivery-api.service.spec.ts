import { HttpTestingController, HttpClientTestingModule, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { mappedShippingRulesFixture, shippingRulesResponseFixture } from '@api/fixtures/delivery/shipping-rules.fixtures';
import { FavouritesApiService, CHECK_FAVOURITES_ENDPOINT } from '@public/core/services/api/favourites/favourites-api.service';
import { DeliveryApiService } from './delivery-api.service';
import { SHIPPING_RULES_ENDPOINT } from './endpoints';
import { ShippingRules } from './interfaces/shipping-rules.interface';

describe('DeliveryApiService', () => {
  let service: DeliveryApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryApiService, FavouritesApiService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DeliveryApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asked to retrieve delivery rules', () => {
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
  });
});
