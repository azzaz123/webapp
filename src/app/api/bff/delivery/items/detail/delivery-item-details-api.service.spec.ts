import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DeliveryItemDetails } from '@api/core/model/delivery/item-detail/delivery-item-details.interface';
import { MOCK_DELIVERY_ITEM_DETAILS } from '@api/fixtures/core/model/delivery/item-detail/delivery-item-detail.fixtures.spec';
import { MOCK_DELIVERY_ITEM_DETAILS_DTO } from '@api/fixtures/delivery/item/detail/delivery-item-details-dto.fixtures.spec';
import { of } from 'rxjs';

import { DeliveryItemDetailsApiService } from './delivery-item-details-api.service';
import { DeliveryItemDetailsHttpService } from './http/delivery-item-details-http.service';

describe('DeliveryItemDetailsApiService', () => {
  let service: DeliveryItemDetailsApiService;
  let deliveryItemDetailsHttpService: DeliveryItemDetailsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeliveryItemDetailsApiService,
        {
          provide: DeliveryItemDetailsHttpService,
          useValue: {
            get() {
              return of(MOCK_DELIVERY_ITEM_DETAILS_DTO);
            },
          },
        },
      ],
    });
    service = TestBed.inject(DeliveryItemDetailsApiService);
    deliveryItemDetailsHttpService = TestBed.inject(DeliveryItemDetailsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get requests as buyer by item', () => {
    const MOCK_ITEM_HASH: string = '9jdxdd2rylzk';
    let response: DeliveryItemDetails;

    beforeEach(fakeAsync(() => {
      spyOn(deliveryItemDetailsHttpService, 'get').and.callThrough();

      service.getDeliveryDetailsByItemHash(MOCK_ITEM_HASH).subscribe((data: DeliveryItemDetails) => (response = data));
      tick();
    }));

    it('should ask server for requests information', () => {
      expect(deliveryItemDetailsHttpService.get).toHaveBeenCalledTimes(1);
      expect(deliveryItemDetailsHttpService.get).toHaveBeenCalledWith(MOCK_ITEM_HASH);
    });

    it('should get the information in web context', () => {
      expect(JSON.stringify(response)).toStrictEqual(JSON.stringify(MOCK_DELIVERY_ITEM_DETAILS));
    });
  });
});
