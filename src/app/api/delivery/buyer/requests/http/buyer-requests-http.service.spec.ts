import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_BUYER_REQUESTS_DTO } from '@api/fixtures/delivery/buyer/requests/buyer-requests-dto.fixtures.spec';
import { BuyerRequestsDto } from '../dtos/buyer-request-dto.interface';

import { BuyerRequestsHttpService } from './buyer-requests-http.service';
import { BUYER_REQUESTS_ENDPOINT, BUYER_REQUESTS_ITEM_HASH_QUERY_PARAM_KEY } from './endpoints';

describe('BuyerRequestsHttpService', () => {
  const MOCK_ITEM_HASH = '9jdxdd2rylzk';
  let service: BuyerRequestsHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BuyerRequestsHttpService],
    });
    service = TestBed.inject(BuyerRequestsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the buyer request by item hash to the server', () => {
    it('should ask server for requests', () => {
      let response: BuyerRequestsDto;
      const expectedUrl: string = `${BUYER_REQUESTS_ENDPOINT}?${BUYER_REQUESTS_ITEM_HASH_QUERY_PARAM_KEY}=${MOCK_ITEM_HASH}`;

      service.get(MOCK_ITEM_HASH).subscribe((data: BuyerRequestsDto) => (response = data));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_BUYER_REQUESTS_DTO);

      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('item_hash')).toEqual(MOCK_ITEM_HASH);
      expect(response).toEqual(MOCK_BUYER_REQUESTS_DTO);
    });
  });
});
