import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';
import { DeliveryCostsHttpService } from '@api/bff/delivery/costs/http/delivery-costs-http.service';
import { DeliveryCostsService } from '@api/bff/delivery/costs/delivery-costs.service';
import { MOCK_DELIVERY_COSTS_ITEM, MOCK_DELIVERY_COSTS_RESPONSE } from '@api/fixtures/bff/delivery/costs/delivery-costs.fixtures.spec';

import { of } from 'rxjs';

describe('DeliveryCostsService', () => {
  let service: DeliveryCostsService;
  let deliveryCostsHttpService: DeliveryCostsHttpService;
  const fakeItemId: string = 'this_is_a_fake_item_id';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveryCostsService, DeliveryCostsHttpService],
    });
    service = TestBed.inject(DeliveryCostsService);
    deliveryCostsHttpService = TestBed.inject(DeliveryCostsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get the costs for an item', () => {
    beforeEach(() => {
      spyOn(deliveryCostsHttpService, 'getCosts').and.returnValue(of(MOCK_DELIVERY_COSTS_RESPONSE));
    });

    it('should get the costs for this specific item', () => {
      service.getCosts(fakeItemId).subscribe();

      expect(deliveryCostsHttpService.getCosts).toHaveBeenCalled();
      expect(deliveryCostsHttpService.getCosts).toHaveBeenCalledWith(fakeItemId);
    });

    it('should map server response to web context', () => {
      let response: DeliveryCosts;

      service.getCosts(fakeItemId).subscribe((data) => (response = data));

      expect(JSON.stringify(response)).toEqual(JSON.stringify(MOCK_DELIVERY_COSTS_ITEM));
    });
  });
});
