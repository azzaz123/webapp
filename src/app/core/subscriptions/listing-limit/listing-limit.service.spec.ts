import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewProSubscriptionPopup } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { ItemService } from '@core/item/item.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MOCK_ITEM_V3_3 } from '@fixtures/item.fixtures.spec';
import {
  FREE_TRIAL_AVAILABLE_NO_DISCOUNTS_SUBSCRIPTION,
  MockSubscriptionService,
  MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED,
  MOCK_SUBSCRIPTION_MOTORBIKE_SUBSCRIBED_MAPPED,
  MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED,
} from '@fixtures/subscriptions.fixtures.spec';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { modalConfig, PRO_MODAL_TYPE } from '@shared/modals/pro-modal/pro-modal.constants';
import { of } from 'rxjs';
import { CATEGORY_SUBSCRIPTIONS_IDS } from '../category-subscription-ids';
import { SUBSCRIPTION_CATEGORIES } from '../subscriptions.interface';
import { SubscriptionsService, SUBSCRIPTION_TYPES } from '../subscriptions.service';

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
    beforeEach(() => {
      spyOn(analyticsService, 'trackPageView').and.callThrough();
    });
    describe('and is car dealer', () => {
      let modal: NgbModalRef;
      beforeEach(() => {
        modal = service.showModal(null, SUBSCRIPTION_TYPES.carDealer);
      });
      it('should show car modal', () => {
        expect(modal.componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.listing_limit_cars_highest_limit]);
      });
      it('should track event', () => {
        const event: AnalyticsPageView<ViewProSubscriptionPopup> = {
          name: ANALYTICS_EVENT_NAMES.ViewProSubscriptionPopup,
          attributes: {
            screenId: SCREEN_IDS.ProSubscriptionLimitPopup,
            subscription: CATEGORY_SUBSCRIPTIONS_IDS.CAR as SUBSCRIPTION_CATEGORIES,
            freeTrial: null,
            isCarDealer: true,
            discount: false,
          },
        };
        expect(analyticsService.trackPageView).toBeCalledTimes(1);
        expect(analyticsService.trackPageView).toBeCalledWith(event);
      });
    });
    describe('and is not car dealer', () => {
      describe('and has the highest limit', () => {
        beforeEach(() => {
          spyOn(subscriptionsService, 'hasHighestLimit').and.returnValue(true);
        });
        describe('and is car subscription', () => {
          beforeEach(() => {
            spyOn(subscriptionsService, 'getSubscriptionByCategory').and.returnValue(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED);
          });
          it('should show car modal', () => {
            const modal = service.showModal('1', SUBSCRIPTION_TYPES.stripe);

            expect(modal.componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.listing_limit_cars_highest_limit]);
          });
          it('should track event', () => {
            service.showModal('1', SUBSCRIPTION_TYPES.stripe);

            const event: AnalyticsPageView<ViewProSubscriptionPopup> = {
              name: ANALYTICS_EVENT_NAMES.ViewProSubscriptionPopup,
              attributes: {
                screenId: SCREEN_IDS.ProSubscriptionLimitPopup,
                subscription: CATEGORY_SUBSCRIPTIONS_IDS.CAR as SUBSCRIPTION_CATEGORIES,
                freeTrial: true,
                isCarDealer: false,
                discount: false,
              },
            };
            expect(analyticsService.trackPageView).toBeCalledTimes(1);
            expect(analyticsService.trackPageView).toBeCalledWith(event);
          });
        });
        describe('and is real estate subscription', () => {
          beforeEach(() => {
            spyOn(subscriptionsService, 'getSubscriptionByCategory').and.returnValue(MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED);
          });
          it('should show real estate modal', () => {
            const modal = service.showModal('1', SUBSCRIPTION_TYPES.stripe);

            expect(modal.componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.listing_limit_real_estate_highest_limit]);
          });
          it('should track event', () => {
            service.showModal('1', SUBSCRIPTION_TYPES.stripe);

            const event: AnalyticsPageView<ViewProSubscriptionPopup> = {
              name: ANALYTICS_EVENT_NAMES.ViewProSubscriptionPopup,
              attributes: {
                screenId: SCREEN_IDS.ProSubscriptionLimitPopup,
                subscription: CATEGORY_SUBSCRIPTIONS_IDS.REAL_ESTATE as SUBSCRIPTION_CATEGORIES,
                freeTrial: true,
                isCarDealer: false,
                discount: false,
              },
            };
            expect(analyticsService.trackPageView).toBeCalledTimes(1);
            expect(analyticsService.trackPageView).toBeCalledWith(event);
          });
        });
        describe('and is consumer good subscription', () => {
          beforeEach(() => {
            spyOn(subscriptionsService, 'getSubscriptionByCategory').and.returnValue(MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED);
          });
          it('should show consumer good modal', () => {
            const modal = service.showModal('1', SUBSCRIPTION_TYPES.stripe);

            expect(modal.componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.listing_limit_consumer_good_highest_limit]);
          });
          it('should track event', () => {
            service.showModal('1', SUBSCRIPTION_TYPES.stripe);

            const event: AnalyticsPageView<ViewProSubscriptionPopup> = {
              name: ANALYTICS_EVENT_NAMES.ViewProSubscriptionPopup,
              attributes: {
                screenId: SCREEN_IDS.ProSubscriptionLimitPopup,
                subscription: CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS as SUBSCRIPTION_CATEGORIES,
                freeTrial: true,
                isCarDealer: false,
                discount: false,
              },
            };
            expect(analyticsService.trackPageView).toBeCalledTimes(1);
            expect(analyticsService.trackPageView).toBeCalledWith(event);
          });
        });
        describe('and it has not a custom modal', () => {
          beforeEach(() => {
            spyOn(subscriptionsService, 'getSubscriptionByCategory').and.returnValue(MOCK_SUBSCRIPTION_MOTORBIKE_SUBSCRIBED_MAPPED);
          });
          it('should show tier limit modal', () => {
            const modal = service.showModal('1', SUBSCRIPTION_TYPES.stripe);

            expect(modal.componentInstance.modalConfig).toBe(modalConfig[PRO_MODAL_TYPE.listing_limit_tier_limit]);
          });
          it('should track event', () => {
            service.showModal('1', SUBSCRIPTION_TYPES.stripe);

            const event: AnalyticsPageView<ViewProSubscriptionPopup> = {
              name: ANALYTICS_EVENT_NAMES.ViewProSubscriptionPopup,
              attributes: {
                screenId: SCREEN_IDS.ProSubscriptionLimitPopup,
                subscription: CATEGORY_SUBSCRIPTIONS_IDS.MOTORBIKE as SUBSCRIPTION_CATEGORIES,
                freeTrial: true,
                isCarDealer: false,
                discount: false,
              },
            };
            expect(analyticsService.trackPageView).toBeCalledTimes(1);
            expect(analyticsService.trackPageView).toBeCalledWith(event);
          });
        });
      });
    });
  });
});
