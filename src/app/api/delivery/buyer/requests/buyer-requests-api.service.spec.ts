import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { BuyerRequestsApiService } from '@api/delivery/buyer/requests/buyer-requests-api.service';
import { BuyerRequestsHttpService } from '@api/delivery/buyer/requests/http/buyer-requests-http.service';
import { BuyerRequestsItemsDetails } from '@api/core/model/delivery/buyer-request/buyer-requests-items-details.interface';
import { MOCK_BUYER_REQUESTS } from '@api/fixtures/core/model/delivery/buyer-requests/buyer-request.fixtures.spec';
import { MOCK_BUYER_REQUESTS_DTO } from '@api/fixtures/delivery/buyer/requests/buyer-requests-dto.fixtures.spec';
import {
  MOCK_BUYER_REQUESTS_ITEMS_DETAILS,
  MOCK_BUYER_REQUESTS_ITEMS_DETAILS_DTO,
} from '@api/fixtures/delivery/buyer/requests/buyer-requests-items-details-dto.fixtures.spec';

import { of } from 'rxjs';

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
            getItemsDetails() {
              return of(MOCK_BUYER_REQUESTS_ITEMS_DETAILS_DTO);
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
    const MOCK_ITEM_HASH: string = '9jdxdd2rylzk';
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

  describe('when asking to get the items details', () => {
    const fakeItemId: string = '9jdxdd2rylzk';
    let response: BuyerRequestsItemsDetails;

    beforeEach(fakeAsync(() => {
      spyOn(buyerRequestsHttpService, 'getItemsDetails').and.callThrough();

      service.getRequestsItemsDetails(fakeItemId).subscribe((data: BuyerRequestsItemsDetails) => (response = data));
      tick();
    }));

    it('should ask server for the details', () => {
      expect(buyerRequestsHttpService.getItemsDetails).toHaveBeenCalledTimes(1);
      expect(buyerRequestsHttpService.getItemsDetails).toHaveBeenCalledWith(fakeItemId);
    });

    it('should return the request response mapped into our model domain', () => {
      expect(response).toMatchObject(MOCK_BUYER_REQUESTS_ITEMS_DETAILS);
    });
  });
});
