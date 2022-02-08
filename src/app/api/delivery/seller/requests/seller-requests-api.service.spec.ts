import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { MOCK_SELLER_REQUEST_DTO } from '@api/fixtures/delivery/seller/requests/seller-request-dto.fixtures.spec';
import { MOCK_SELLER_REQUEST } from '@fixtures/private/delivery/seller-requests/seller-request.fixtures.spec';
import { of } from 'rxjs';
import { SellerRequestsHttpService } from './http/seller-requests-http.service';

import { SellerRequestsApiService } from './seller-requests-api.service';
import { MOCK_LOCATION_ACCURACY } from '@api/fixtures/delivery/seller/requests/seller-request-location.fixtures.spec';

describe('SellerRequestsApiService', () => {
  let service: SellerRequestsApiService;
  let sellerRequestsHttpService: SellerRequestsHttpService;
  const MOCK_REQUEST_ID: string = '392183AK28923';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SellerRequestsApiService,
        {
          provide: SellerRequestsHttpService,
          useValue: {
            getRequestInfo() {
              return of(MOCK_SELLER_REQUEST_DTO);
            },
            cancelRequest() {
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

  describe('when asking to get a seller request information', () => {
    let response: SellerRequest;

    beforeEach(fakeAsync(() => {
      spyOn(sellerRequestsHttpService, 'getRequestInfo').and.callThrough();

      service.getRequestInfo(MOCK_REQUEST_ID).subscribe((data: SellerRequest) => (response = data));
      tick();
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
      spyOn(sellerRequestsHttpService, 'cancelRequest').and.callThrough();

      service.cancelRequest(MOCK_REQUEST_ID).subscribe();
      tick();
    }));

    it('should ask server to cancel the request', () => {
      expect(sellerRequestsHttpService.cancelRequest).toHaveBeenCalledTimes(1);
      expect(sellerRequestsHttpService.cancelRequest).toHaveBeenCalledWith(MOCK_REQUEST_ID);
    });
  });

  describe('when asking to accept a request with post office drop off mode', () => {
    beforeEach(fakeAsync(() => {
      spyOn(sellerRequestsHttpService, 'acceptRequestPostOfficeDropOff').and.callThrough();

      service.acceptRequestPostOfficeDropOff(MOCK_REQUEST_ID, MOCK_LOCATION_ACCURACY).subscribe();
      tick();
    }));

    it('should ask server to accept the request with post office drop off mode', () => {
      expect(sellerRequestsHttpService.acceptRequestPostOfficeDropOff).toHaveBeenCalledTimes(1);
      expect(sellerRequestsHttpService.acceptRequestPostOfficeDropOff).toHaveBeenCalledWith(MOCK_REQUEST_ID, MOCK_LOCATION_ACCURACY);
    });
  });

  describe('when asking to accept a request with home pickup mode', () => {
    beforeEach(fakeAsync(() => {
      spyOn(sellerRequestsHttpService, 'acceptRequestHomePickup').and.callThrough();

      service.acceptRequestHomePickup(MOCK_REQUEST_ID).subscribe();
      tick();
    }));

    it('should ask server to accept the request with post office drop off mode', () => {
      expect(sellerRequestsHttpService.acceptRequestHomePickup).toHaveBeenCalledTimes(1);
      expect(sellerRequestsHttpService.acceptRequestHomePickup).toHaveBeenCalledWith(MOCK_REQUEST_ID);
    });
  });
});
