import { fakeAsync, TestBed } from '@angular/core/testing';
import { NonPurchasableItemError, PostalCodeNotFoundError } from '@api/core/errors/delivery/accept-screen/accept-request';
import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { MOCK_SELLER_REQUEST_DTO } from '@api/fixtures/delivery/seller/requests/seller-request-dto.fixtures.spec';
import {
  MOCK_ACCEPT_SCREEN_NON_PURCHASABLE_ITEM_ERROR_RESPONSE,
  MOCK_ACCEPT_SCREEN_POSTAL_CODE_NOT_FOUND_ERROR_RESPONSE,
} from '@fixtures/private/delivery/accept-screen/accept-screen-errors.fixtures.spec';
import { MOCK_SELLER_REQUEST } from '@fixtures/private/delivery/seller-requests/seller-request.fixtures.spec';
import { of, throwError } from 'rxjs';
import { AcceptRequestErrorDto } from './dtos/errors';
import { SellerRequestsHttpService } from './http/seller-requests-http.service';

import { SellerRequestsApiService } from './seller-requests-api.service';

describe('SellerRequestsApiService', () => {
  let service: SellerRequestsApiService;
  let sellerRequestsHttpService: SellerRequestsHttpService;
  const MOCK_REQUEST_ID: string = '392183AK28923';
  const MOCK_ITEM_HASH: string = 'dqjwm31nkezo';
  const MOCK_BUYER_HASH: string = 'mxzod8nyv4j9';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SellerRequestsApiService,
        {
          provide: SellerRequestsHttpService,
          useValue: {
            getRequestsByBuyerAndItem() {
              return of([MOCK_SELLER_REQUEST_DTO, MOCK_SELLER_REQUEST_DTO]);
            },
            getRequestInfo() {
              return of(MOCK_SELLER_REQUEST_DTO);
            },
            rejectRequest() {
              return of();
            },
            acceptRequestPostOfficeDropOff() {
              return of();
            },
            acceptRequestHomePickup() {
              return of();
            },
          },
        },
      ],
    });
    service = TestBed.inject(SellerRequestsApiService);
    sellerRequestsHttpService = TestBed.inject(SellerRequestsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get all seller requests for specific item and buyer', () => {
    let response: SellerRequest[];

    beforeEach(fakeAsync(() => {
      spyOn(sellerRequestsHttpService, 'getRequestsByBuyerAndItem').and.callThrough();

      service.getRequestsByBuyerAndItem(MOCK_BUYER_HASH, MOCK_ITEM_HASH).subscribe((data: SellerRequest[]) => (response = data));
    }));

    it('should ask server for request information', () => {
      expect(sellerRequestsHttpService.getRequestsByBuyerAndItem).toHaveBeenCalledTimes(1);
      expect(sellerRequestsHttpService.getRequestsByBuyerAndItem).toHaveBeenCalledWith(MOCK_BUYER_HASH, MOCK_ITEM_HASH);
    });

    it('should return the request response mapped into our model domain', () => {
      expect(JSON.stringify(response)).toStrictEqual(JSON.stringify([MOCK_SELLER_REQUEST, MOCK_SELLER_REQUEST]));
    });
  });

  describe('when asking to get a seller request information', () => {
    let response: SellerRequest;

    beforeEach(fakeAsync(() => {
      spyOn(sellerRequestsHttpService, 'getRequestInfo').and.callThrough();

      service.getRequestInfo(MOCK_REQUEST_ID).subscribe((data: SellerRequest) => (response = data));
    }));

    it('should ask server for request information', () => {
      expect(sellerRequestsHttpService.getRequestInfo).toHaveBeenCalledTimes(1);
      expect(sellerRequestsHttpService.getRequestInfo).toHaveBeenCalledWith(MOCK_REQUEST_ID);
    });

    it('should return the request response mapped into our model domain', () => {
      expect(JSON.stringify(response)).toStrictEqual(JSON.stringify(MOCK_SELLER_REQUEST));
    });
  });

  describe('when asking to cancel a request', () => {
    beforeEach(fakeAsync(() => {
      spyOn(sellerRequestsHttpService, 'rejectRequest').and.callThrough();

      service.rejectRequest(MOCK_REQUEST_ID).subscribe();
    }));

    it('should ask server to cancel the request', () => {
      expect(sellerRequestsHttpService.rejectRequest).toHaveBeenCalledTimes(1);
      expect(sellerRequestsHttpService.rejectRequest).toHaveBeenCalledWith(MOCK_REQUEST_ID);
    });
  });

  describe('when asking to accept a request with post office drop off mode', () => {
    describe('and the request succeed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(sellerRequestsHttpService, 'acceptRequestPostOfficeDropOff').and.callThrough();

        service.acceptRequestPostOfficeDropOff(MOCK_REQUEST_ID).subscribe();
      }));

      it('should ask server to accept the request with post office drop off mode', () => {
        expect(sellerRequestsHttpService.acceptRequestPostOfficeDropOff).toHaveBeenCalledTimes(1);
        expect(sellerRequestsHttpService.acceptRequestPostOfficeDropOff).toHaveBeenCalledWith(MOCK_REQUEST_ID);
      });
    });

    describe('and the request fails and returns a backend error', () => {
      let errors: AcceptRequestErrorDto[];

      beforeEach(fakeAsync(() => {
        spyOn(sellerRequestsHttpService, 'acceptRequestPostOfficeDropOff').and.returnValue(
          throwError(MOCK_ACCEPT_SCREEN_NON_PURCHASABLE_ITEM_ERROR_RESPONSE)
        );

        service.acceptRequestPostOfficeDropOff(MOCK_REQUEST_ID).subscribe({
          error: (errorResponse: AcceptRequestErrorDto[]) => (errors = errorResponse),
        });
      }));

      it('should ask server to accept the request with post office drop off mode', () => {
        expect(sellerRequestsHttpService.acceptRequestPostOfficeDropOff).toHaveBeenCalledTimes(1);
        expect(sellerRequestsHttpService.acceptRequestPostOfficeDropOff).toHaveBeenCalledWith(MOCK_REQUEST_ID);
      });

      it('should return the error mapped', () => {
        expect(errors[0] instanceof NonPurchasableItemError).toBe(true);
      });
    });
  });

  describe('when asking to accept a request with home pickup mode', () => {
    describe('and the request succeed', () => {
      beforeEach(fakeAsync(() => {
        spyOn(sellerRequestsHttpService, 'acceptRequestHomePickup').and.callThrough();

        service.acceptRequestHomePickup(MOCK_REQUEST_ID).subscribe();
      }));

      it('should ask server to accept the request with post office drop off mode', () => {
        expect(sellerRequestsHttpService.acceptRequestHomePickup).toHaveBeenCalledTimes(1);
        expect(sellerRequestsHttpService.acceptRequestHomePickup).toHaveBeenCalledWith(MOCK_REQUEST_ID);
      });
    });

    describe('and the request fails and returns a backend error', () => {
      let errors: AcceptRequestErrorDto[];

      beforeEach(fakeAsync(() => {
        spyOn(sellerRequestsHttpService, 'acceptRequestHomePickup').and.returnValue(
          throwError(MOCK_ACCEPT_SCREEN_POSTAL_CODE_NOT_FOUND_ERROR_RESPONSE)
        );

        service.acceptRequestHomePickup(MOCK_REQUEST_ID).subscribe({
          error: (errorResponse: AcceptRequestErrorDto[]) => (errors = errorResponse),
        });
      }));

      it('should ask server to accept the request with post office drop off mode', () => {
        expect(sellerRequestsHttpService.acceptRequestHomePickup).toHaveBeenCalledTimes(1);
        expect(sellerRequestsHttpService.acceptRequestHomePickup).toHaveBeenCalledWith(MOCK_REQUEST_ID);
      });

      it('should return the error mapped', () => {
        expect(errors[0] instanceof PostalCodeNotFoundError).toBe(true);
      });
    });
  });
});
