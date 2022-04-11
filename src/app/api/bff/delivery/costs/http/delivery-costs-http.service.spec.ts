import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DELIVERY_COSTS_ENDPOINT } from '@api/bff/delivery/costs/http/endpoints';
import { DeliveryCostsDto } from '@api/bff/delivery/costs/dtos';
import { DeliveryCostsHttpService } from '@api/bff/delivery/costs/http/delivery-costs-http.service';
import { MOCK_DELIVERY_COSTS_RESPONSE } from '@api/fixtures/bff/delivery/costs/delivery-costs.fixtures.spec';

describe('DeliveryCostsHttpService', () => {
  let service: DeliveryCostsHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryCostsHttpService],
    });
    service = TestBed.inject(DeliveryCostsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the costs information', () => {
    it('should get the corresponding information', () => {
      let response: DeliveryCostsDto;
      const itemId: string = 'the_item_id';

      service.getCosts(itemId).subscribe((data) => (response = data));
      const req: TestRequest = httpMock.expectOne(DELIVERY_COSTS_ENDPOINT(itemId));
      req.flush(MOCK_DELIVERY_COSTS_RESPONSE);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(MOCK_DELIVERY_COSTS_RESPONSE);
    });
  });
});
