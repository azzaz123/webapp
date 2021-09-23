import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CatalogManagerHttpService } from './http/catalog-manager-http.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { CatalogManagerApiService } from './catalog-manager-api.service';
import { MOCK_SUBSCRIPTION_SLOTS, MOCK_SUBSCRIPTION_SLOTS_GENERAL_RESPONSE } from '@fixtures/subsctiption-slots.fixtures.spec';
import { MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED, MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED } from '@fixtures/subscriptions.fixtures.spec';
import { SubscriptionSlot } from './interfaces/subscription-slot/subscription-slot.interface';

describe('CatalogManagerApiService', () => {
  let service: CatalogManagerApiService;
  let subscriptionsService: SubscriptionsService;
  let httpService: CatalogManagerHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CatalogManagerApiService,
        CatalogManagerHttpService,
        {
          provide: SubscriptionsService,
          useValue: {
            getSubscriptions() {},
          },
        },
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CatalogManagerApiService);
    httpService = TestBed.inject(CatalogManagerHttpService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
  });

  describe('when asked to retrieve subscription slots', () => {
    it('should return domain subscriptions slots formatted', () => {
      spyOn(httpService, 'getSlots').and.returnValue(of(MOCK_SUBSCRIPTION_SLOTS_GENERAL_RESPONSE));
      spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(
        of([MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED, MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED])
      );

      let response: SubscriptionSlot[];

      service.getSlots().subscribe((data: SubscriptionSlot[]) => {
        response = data;
      });

      expect(httpService.getSlots).toHaveBeenCalledTimes(1);
      expect(httpService.getSlots).toHaveBeenCalledWith();
      expect(subscriptionsService.getSubscriptions).toHaveBeenCalledTimes(1);
      expect(subscriptionsService.getSubscriptions).toHaveBeenCalledWith(false);
      expect(response).toEqual(MOCK_SUBSCRIPTION_SLOTS);
    });
  });
});
