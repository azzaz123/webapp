import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { MOCK_SELLER_REQUEST_DTO } from '@api/fixtures/delivery/seller/requests/seller-request-dto.fixtures.spec';
import { MOCK_SELLER_REQUEST } from '@fixtures/private/delivery/seller-requests/seller-request.fixtures.spec';
import { of } from 'rxjs';
import { SellerRequestsHttpService } from './http/seller-requests-http.service';

import { SellerRequestsApiService } from './seller-requests-api.service';

describe('SellerRequestsApiService', () => {
  let service: SellerRequestsApiService;
  let sellerRequestsHttpService: SellerRequestsHttpService;

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
    const MOCK_REQUEST_ID = '392183AK28923';
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
});
