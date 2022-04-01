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
import { of, throwError } from 'rxjs';
import { UuidService } from '@core/uuid/uuid.service';
import {
  MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS,
  MOCK_BUYER_REQUEST_BUY_DTO_WITH_CARRIER_OFFICE,
  MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS_AND_PROMOCODE,
} from '@api/fixtures/delivery/buyer/requests/buyer-request-buy-dto.fixtures.spec';
import {
  MOCK_PAYVIEW_STATE,
  MOCK_PAYVIEW_STATE_WITH_CARRIER_OFFICE_DELIVERY_METHOD,
  MOCK_PAYVIEW_STATE_WITH_PROMOCODE,
} from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { MOCK_NO_CARRIER_OFFICE_ADDRESS_FOR_USER_ERROR_RESPONSE } from '@fixtures/private/delivery/payview/buy-request-errors.fixtures.spec';
import { BuyerRequestsError } from '@api/core/errors/delivery/payview/buyer-requests';
import { NoCarrierOfficeAddressForUserError } from '@api/core/errors/delivery/payview/buyer-requests/no-carrier-office-address-for-user.error';

describe('BuyerRequestsApiService', () => {
  const MOCK_UUID: string = '12345';
  let service: BuyerRequestsApiService;
  let buyerRequestsHttpService: BuyerRequestsHttpService;
  let uuidService: UuidService;

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
            buy() {
              return of({});
            },
          },
        },
        {
          provide: UuidService,
          useValue: {
            getUUID() {
              return MOCK_UUID;
            },
          },
        },
      ],
    });
    service = TestBed.inject(BuyerRequestsApiService);
    buyerRequestsHttpService = TestBed.inject(BuyerRequestsHttpService);
    uuidService = TestBed.inject(UuidService);
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

  describe('when asking to buy the buyer request with buyer address as delivery mode', () => {
    describe('and the request succeed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(buyerRequestsHttpService, 'buy').and.callThrough();
        spyOn(uuidService, 'getUUID').and.callThrough();

        service.buyRequest(MOCK_PAYVIEW_STATE).subscribe();
        tick();
      }));

      it('should generate new uuid for the buy request', () => {
        expect(uuidService.getUUID).toHaveBeenCalledTimes(1);
      });

      it('should ask server to buy the buyer request', () => {
        expect(buyerRequestsHttpService.buy).toHaveBeenCalledTimes(1);
        expect(buyerRequestsHttpService.buy).toHaveBeenCalledWith(MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS);
      });
    });

    describe('and the request fails and returns a backend error', () => {
      let errors: BuyerRequestsError[];

      beforeEach(fakeAsync(() => {
        spyOn(buyerRequestsHttpService, 'buy').and.returnValue(throwError(MOCK_NO_CARRIER_OFFICE_ADDRESS_FOR_USER_ERROR_RESPONSE));
        spyOn(uuidService, 'getUUID').and.callThrough();

        service.buyRequest(MOCK_PAYVIEW_STATE).subscribe({
          error: (errorResponse: BuyerRequestsError[]) => (errors = errorResponse),
        });
        tick();
      }));

      it('should generate new uuid for the buy request', () => {
        expect(uuidService.getUUID).toHaveBeenCalledTimes(1);
      });

      it('should ask server to buy the buyer request', () => {
        expect(buyerRequestsHttpService.buy).toHaveBeenCalledTimes(1);
        expect(buyerRequestsHttpService.buy).toHaveBeenCalledWith(MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS);
      });

      it('should return the error mapped', () => {
        expect(errors[0] instanceof NoCarrierOfficeAddressForUserError).toBe(true);
      });
    });
  });

  describe('when asking to buy the buyer request with carrier office as delivery mode', () => {
    describe('and the request succeed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(buyerRequestsHttpService, 'buy').and.callThrough();
        spyOn(uuidService, 'getUUID').and.callThrough();

        service.buyRequest(MOCK_PAYVIEW_STATE_WITH_CARRIER_OFFICE_DELIVERY_METHOD).subscribe();
        tick();
      }));

      it('should generate new uuid for the buy request', () => {
        expect(uuidService.getUUID).toHaveBeenCalledTimes(1);
      });

      it('should ask server to buy the buyer request', () => {
        expect(buyerRequestsHttpService.buy).toHaveBeenCalledTimes(1);
        expect(buyerRequestsHttpService.buy).toHaveBeenCalledWith(MOCK_BUYER_REQUEST_BUY_DTO_WITH_CARRIER_OFFICE);
      });
    });
  });

  describe('when asking to buy the buyer request with a promocode', () => {
    describe('and the request succeed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(buyerRequestsHttpService, 'buy').and.callThrough();
        spyOn(uuidService, 'getUUID').and.callThrough();

        service.buyRequest(MOCK_PAYVIEW_STATE_WITH_PROMOCODE).subscribe();
        tick();
      }));

      it('should generate new uuid for the buy request', () => {
        expect(uuidService.getUUID).toHaveBeenCalledTimes(1);
      });

      it('should ask server to buy the buyer request', () => {
        expect(buyerRequestsHttpService.buy).toHaveBeenCalledTimes(1);
        expect(buyerRequestsHttpService.buy).toHaveBeenCalledWith(MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS_AND_PROMOCODE);
      });
    });
  });
});
