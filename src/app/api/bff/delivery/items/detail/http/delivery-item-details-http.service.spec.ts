import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_DELIVERY_ITEM_DETAILS_DTO } from '@api/fixtures/delivery/item/detail/delivery-item-details-dto.fixtures.spec';
import { APP_VERSION } from '@environments/version';
import { DeliveryItemDetailsDto } from '../dtos/delivery-item-detail-dto.interface';

import { DeliveryItemDetailsHttpService } from './delivery-item-details-http.service';
import { DELIVERY_ITEM_DETAILS_ENDPOINT } from './endpoints';

describe('DeliveryItemDetailsHttpService', () => {
  const MOCK_ITEM_HASH: string = '9jdxdd2rylzk';
  let service: DeliveryItemDetailsHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryItemDetailsHttpService],
    });
    service = TestBed.inject(DeliveryItemDetailsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the delivery item details by item hash to the server', () => {
    it('should ask server for item details', () => {
      let response: DeliveryItemDetailsDto;
      const expectedUrl: string = DELIVERY_ITEM_DETAILS_ENDPOINT(MOCK_ITEM_HASH);
      const expectedAppVersionHeaderValue: string = APP_VERSION.replace(/\./g, '');

      service.get(MOCK_ITEM_HASH).subscribe((data: DeliveryItemDetailsDto) => (response = data));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_DELIVERY_ITEM_DETAILS_DTO);

      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('X-AppVersion')).toEqual(expectedAppVersionHeaderValue);
      expect(response).toEqual(MOCK_DELIVERY_ITEM_DETAILS_DTO);
    });
  });
});
