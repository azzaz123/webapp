import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TooManyItemsModalComponent } from './too-many-items-modal.component';
import { ButtonComponent } from '../../../button/button.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ItemService } from '../../../../core/item/item.service';
import { SubscriptionsService } from '../../../../core/subscriptions/subscriptions.service';
import { MOCK_ITEM_V3_3 } from '../../../../../tests/item.fixtures.spec';
import {
  MockSubscriptionService,
  MAPPED_SUBSCRIPTIONS_ADDED,
  MAPPED_SUBSCRIPTIONS_WITH_RE,
  TIER_WITH_DISCOUNT,
} from '@fixtures/subscriptions.fixtures.spec';
import { SUBSCRIPTION_TYPES } from '../../../../core/subscriptions/subscriptions.service';
import { AnalyticsService } from 'app/core/analytics/analytics.service';
import { MockAnalyticsService } from '../../../../../tests/analytics.fixtures.spec';
import { AnalyticsPageView, ViewProSubscriptionPopup, ANALYTICS_EVENT_NAMES, SCREEN_IDS } from 'app/core/analytics/analytics-constants';
import { SUBSCRIPTION_CATEGORIES } from 'app/core/subscriptions/subscriptions.interface';
import { MOCK_CAR } from '../../../../../tests/car.fixtures.spec';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { MOCK_REALESTATE } from '@fixtures/realestate.fixtures.spec';

describe('TooManyItemsModalComponent', () => {
  let component: TooManyItemsModalComponent;
  let fixture: ComponentFixture<TooManyItemsModalComponent>;
  let itemService: ItemService;
  let subscriptionsService: SubscriptionsService;
  let analyticsService: AnalyticsService;
  let i18nService: I18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [TooManyItemsModalComponent, ButtonComponent],
      providers: [
        NgbActiveModal,
        I18nService,
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
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TooManyItemsModalComponent);
    itemService = TestBed.inject(ItemService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    analyticsService = TestBed.inject(AnalyticsService);
    i18nService = TestBed.inject(I18nService);
    component = fixture.componentInstance;
    component.type = SUBSCRIPTION_TYPES.stripe;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(of(MAPPED_SUBSCRIPTIONS_ADDED));
      spyOn(subscriptionsService, 'getSubscriptionByCategory').and.returnValue(MAPPED_SUBSCRIPTIONS_ADDED[1]);
      spyOn(subscriptionsService, 'hasFreeTrialByCategoryId').and.returnValue(false);
      spyOn(analyticsService, 'trackPageView');
    });

    describe('when subscription for item category has free trial', () => {
      beforeEach(() => {
        component.itemId = MOCK_ITEM_V3_3.id;
        spyOn(itemService, 'get').and.returnValue(of(MOCK_ITEM_V3_3));
        spyOn(subscriptionsService, 'hasFreeTrialByCategoryId').and.returnValue(true);
      });

      it('should set isFreeTrial to true', () => {
        component.ngOnInit();

        expect(component.isFreeTrial).toBe(true);
      });

      it('should track the page view event to analytics', () => {
        const expectedEvent: AnalyticsPageView<ViewProSubscriptionPopup> = {
          name: ANALYTICS_EVENT_NAMES.ViewProSubscriptionPopup,
          attributes: {
            screenId: SCREEN_IDS.ProSubscriptionLimitPopup,
            subscription: MAPPED_SUBSCRIPTIONS_ADDED[1].category_id as SUBSCRIPTION_CATEGORIES,
            freeTrial: true,
            isCarDealer: false,
            discount: false,
          },
        };

        component.ngOnInit();

        expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedEvent);
      });
    });

    describe('when subscription for item category does not have free trial', () => {
      beforeEach(() => {
        component.itemId = MOCK_CAR.id;
        spyOn(itemService, 'get').and.returnValue(of(MOCK_CAR));
      });

      it('should set isFreeTrial to false', () => {
        component.ngOnInit();

        expect(component.isFreeTrial).toBe(false);
      });

      it('should track the page view event to analytics', fakeAsync(() => {
        const expectedEvent: AnalyticsPageView<ViewProSubscriptionPopup> = {
          name: ANALYTICS_EVENT_NAMES.ViewProSubscriptionPopup,
          attributes: {
            screenId: SCREEN_IDS.ProSubscriptionLimitPopup,
            subscription: MAPPED_SUBSCRIPTIONS_ADDED[1].category_id as SUBSCRIPTION_CATEGORIES,
            freeTrial: false,
            isCarDealer: false,
            discount: false,
          },
        };

        component.ngOnInit();
        tick();

        expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedEvent);
      }));
    });

    describe('when subscription for item category has a tier with discount', () => {
      beforeEach(() => {
        component.itemId = MOCK_CAR.id;
        spyOn(itemService, 'get').and.returnValue(of(MOCK_CAR));
        spyOn(subscriptionsService, 'tierDiscountByCategoryId').and.returnValue(TIER_WITH_DISCOUNT);
      });

      it('should track the page view event to analytics', fakeAsync(() => {
        const expectedEvent: AnalyticsPageView<ViewProSubscriptionPopup> = {
          name: ANALYTICS_EVENT_NAMES.ViewProSubscriptionPopup,
          attributes: {
            screenId: SCREEN_IDS.ProSubscriptionLimitPopup,
            subscription: MAPPED_SUBSCRIPTIONS_ADDED[1].category_id as SUBSCRIPTION_CATEGORIES,
            freeTrial: false,
            isCarDealer: false,
            discount: true,
          },
        };

        component.ngOnInit();
        tick();

        expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedEvent);
      }));
    });
  });
  describe('Tier limit', () => {
    beforeEach(() => {
      spyOn(i18nService, 'translate').and.callThrough();
    });
    describe('when tier has the highest limit', () => {
      beforeEach(() => {
        spyOn(subscriptionsService, 'hasHighestLimit').and.returnValue(true);
      });
      describe('and is tier limited managed', () => {
        beforeEach(() => {
          spyOn(itemService, 'get').and.returnValue(of(MOCK_REALESTATE));
          spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(of(MAPPED_SUBSCRIPTIONS_WITH_RE));
          spyOn(subscriptionsService, 'getSubscriptionByCategory').and.returnValue(MAPPED_SUBSCRIPTIONS_WITH_RE[0]);
          component.itemId = MOCK_REALESTATE.id;
          component.ngOnInit();
        });
        it('should show highest limit reached', fakeAsync(() => {
          tick();
          fixture.detectChanges();

          expect(component.isHighestLimit).toBe(true);
        }));
        it('should call zendesk link', fakeAsync(() => {
          tick();
          fixture.detectChanges();

          expect(i18nService.translate).toHaveBeenCalledWith(TRANSLATION_KEY.ZENDESK_REAL_ESTATE_LIMIT_URL);
        }));
        it('should call description text', fakeAsync(() => {
          tick();
          fixture.detectChanges();

          expect(i18nService.translate).toHaveBeenCalledWith(TRANSLATION_KEY.REAL_ESTATE_HIGHEST_LIMIT_REACHED_DESCRIPTION);
        }));
      });
      describe('and is tier limited not managed', () => {
        beforeEach(() => {
          component.ngOnInit();
        });
        it('should not show highest limit reached', fakeAsync(() => {
          tick();
          fixture.detectChanges();

          expect(component.isHighestLimit).toBe(false);
        }));
        it('should not call zendesk link', fakeAsync(() => {
          tick();
          fixture.detectChanges();

          expect(i18nService.translate).not.toHaveBeenCalledWith(TRANSLATION_KEY.ZENDESK_REAL_ESTATE_LIMIT_URL);
        }));
        it('should not call description text', fakeAsync(() => {
          tick();
          fixture.detectChanges();

          expect(i18nService.translate).not.toHaveBeenCalledWith(TRANSLATION_KEY.REAL_ESTATE_HIGHEST_LIMIT_REACHED_DESCRIPTION);
        }));
      });
    });
    describe('when tier has not the highest limit', () => {
      beforeEach(() => {
        spyOn(subscriptionsService, 'hasHighestLimit').and.returnValue(false);
      });
      describe('and is tier limited managed', () => {
        beforeEach(() => {
          spyOn(itemService, 'get').and.returnValue(of(MOCK_REALESTATE));
          spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(of(MAPPED_SUBSCRIPTIONS_WITH_RE));
          component.itemId = MOCK_REALESTATE.id;
          component.ngOnInit();
        });
        it('should not show highest limit reached', fakeAsync(() => {
          tick();
          fixture.detectChanges();

          expect(component.isHighestLimit).toBe(false);
        }));
        it('should not call zendesk link', fakeAsync(() => {
          tick();
          fixture.detectChanges();

          expect(i18nService.translate).not.toHaveBeenCalledWith(TRANSLATION_KEY.ZENDESK_REAL_ESTATE_LIMIT_URL);
        }));
        it('should not call description text', fakeAsync(() => {
          tick();
          fixture.detectChanges();

          expect(i18nService.translate).not.toHaveBeenCalledWith(TRANSLATION_KEY.REAL_ESTATE_HIGHEST_LIMIT_REACHED_DESCRIPTION);
        }));
      });
    });
  });
});
