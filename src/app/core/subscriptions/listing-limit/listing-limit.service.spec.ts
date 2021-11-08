import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { ItemService } from '@core/item/item.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MOCK_ITEM_V3_3 } from '@fixtures/item.fixtures.spec';
import { MockSubscriptionService } from '@fixtures/subscriptions.fixtures.spec';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { SubscriptionsService } from '../subscriptions.service';

import { ListingLimitService } from './listing-limit.service';

describe('ListingLimitService', () => {
  let service: ListingLimitService;
  let itemService: ItemService;
  let subscriptionsService: SubscriptionsService;
  let analyticsService: AnalyticsService;
  let customerHelpService: CustomerHelpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ListingLimitService,
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: {},
              };
            },
          },
        },
        CustomerHelpService,
        { provide: SubscriptionsService, useClass: MockSubscriptionService },
        {
          provide: ItemService,
          useValue: {
            get() {
              return of(MOCK_ITEM_V3_3);
            },
          },
        },
        {
          provide: AnalyticsService,
          useClass: MockAnalyticsService,
        },
      ],
    });
    service = TestBed.inject(ListingLimitService);
    itemService = TestBed.inject(ItemService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    analyticsService = TestBed.inject(AnalyticsService);
    customerHelpService = TestBed.inject(CustomerHelpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show listing limit modal', () => {
    describe('and is car dealer', () => {});
  });
});
