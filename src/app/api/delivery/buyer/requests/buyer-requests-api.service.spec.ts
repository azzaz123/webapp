import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { MOCK_BUYER_REQUESTS } from '@api/fixtures/core/model/delivery/buyer-requests/buyer-request.fixtures.spec';
import { MOCK_BUYER_REQUESTS_DTO } from '@api/fixtures/delivery/buyer/requests/buyer-requests-dto.fixtures.spec';
import { MOCK_SELLER_REQUEST_DTO } from '@api/fixtures/delivery/seller/requests/seller-request-dto.fixtures.spec';
import { MOCK_SELLER_REQUEST } from '@fixtures/private/delivery/seller-requests/seller-request.fixtures.spec';
import { of } from 'rxjs';

import { BuyerRequestsApiService } from './buyer-requests-api.service';
import { BuyerRequestsHttpService } from './http/buyer-requests-http.service';

describe('BuyerRequestsApiService', () => {
  let service: BuyerRequestsApiService;
  let buyerRequestsHttpService: BuyerRequestsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BuyerRequestsApiService,
        {
          provide: BuyerRequestsHttpService,
          useValue: {
            get() {
              return of(MOCK_BUYER_REQUESTS_DTO);
            },
          },
        },
      ],
    });
    service = TestBed.inject(BuyerRequestsApiService);
    buyerRequestsHttpService = TestBed.inject(BuyerRequestsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get requests as buyer by item', () => {
    const MOCK_ITEM_HASH = '9jdxdd2rylzk';
    let response: BuyerRequest[];

    beforeEach(fakeAsync(() => {
      spyOn(buyerRequestsHttpService, 'get').and.callThrough();

      service.getRequestsAsBuyerByItemHash(MOCK_ITEM_HASH).subscribe((data: BuyerRequest[]) => (response = data));
      tick();
    }));

    it('should ask server for requests information', () => {
      expect(buyerRequestsHttpService.get).toHaveBeenCalledTimes(1);
      expect(buyerRequestsHttpService.get).toHaveBeenCalledWith(MOCK_ITEM_HASH);
    });

    it('should return the request response mapped into our model domain', () => {
      expect(response).toStrictEqual(MOCK_BUYER_REQUESTS);
    });
  });
});
