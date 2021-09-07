import { TestBed } from '@angular/core/testing';
import { SubscriptionsService, SUBSCRIPTIONS_URL, SUBSCRIPTIONS_SLOTS_ENDPOINT, SUBSCRIPTION_TYPES } from './subscriptions.service';
import { of } from 'rxjs';
import { UserService } from '../user/user.service';
import { FeatureFlagService } from '../user/featureflag.service';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { CATEGORY_DATA_WEB } from '../../../tests/category.fixtures.spec';
import { SubscriptionsResponse, SubscriptionSlot, Tier } from './subscriptions.interface';
import {
  SUBSCRIPTIONS,
  MAPPED_SUBSCRIPTIONS,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED,
  MOCK_SUBSCRIPTION_SLOTS_GENERAL_RESPONSE,
  MOCK_SUBSCRIPTION_SLOTS,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_GOOGLE_PLAY_MAPPED,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_APPLE_STORE_MAPPED,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED,
  SUBSCRIPTIONS_NOT_SUB,
  MOCK_SUBSCRIPTIONS_WITH_ONE_GOOGLE_PLAY,
  MOCK_SUBSCRIPTIONS_WITH_ONE_APPLE_STORE,
  MAPPED_SUBSCRIPTIONS_ADDED,
  TIER_DISCOUNT,
  SUBSCTIPTION_WITH_TIER_DISCOUNT,
} from '../../../tests/subscriptions.fixtures.spec';
import { CategoryService } from '../category/category.service';
import { AccessTokenService } from '../http/access-token.service';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../i18n/i18n.service';
import { UuidService } from '../uuid/uuid.service';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { cloneDeep } from 'lodash-es';
import { CATEGORY_SUBSCRIPTIONS_IDS } from './category-subscription-ids';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let userService: UserService;
  let categoryService: CategoryService;
  let uuidService: UuidService;
  const API_URL = 'api/v3/payments';
  const STRIPE_SUBSCRIPTION_URL = 'c2b/stripe/subscription';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SubscriptionsService,
        {
          provide: AccessTokenService,
          useValue: {
            accessToken: 'ACCESS_TOKEN',
          },
        },
        {
          provide: UserService,
          useValue: {
            hasPerm() {
              return of(true);
            },
            me() {
              return of(MOCK_USER);
            },
            isProfessional() {
              return of(true);
            },
          },
        },
        {
          provide: FeatureFlagService,
          useValue: {
            getFlag() {
              return of(false);
            },
          },
        },
        CategoryService,
        I18nService,
      ],
    });
    service = TestBed.inject(SubscriptionsService);
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    categoryService = TestBed.inject(CategoryService);
    uuidService = TestBed.inject(UuidService);
    service.uuid = '1-2-3';
    spyOn(uuidService, 'getUUID').and.returnValue('1-2-3');
    spyOn(categoryService, 'getCategories').and.returnValue(of(CATEGORY_DATA_WEB));
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('newSubscription', () => {
    it('should call endpoint', () => {
      const paymentId = 'a1-b2-c3-d4';
      const subscriptionId = '1a-2b-3c-4d';
      const expectedUrl = `${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/1-2-3`;
      const expectedBody = {
        payment_method_id: paymentId,
        product_subscription_id: subscriptionId,
        billing: false,
      };

      service.newSubscription(subscriptionId, paymentId).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('checkNewSubscriptionStatus', () => {
    it('should call endpoint', () => {
      const expectedUrl = `${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/1-2-3`;

      service.checkNewSubscriptionStatus().subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('checkRetrySubscriptionStatus', () => {
    it('should call endpoint', () => {
      const expectedUrl = `${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/payment_attempt/1-2-3`;

      service.checkRetrySubscriptionStatus().subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('retrySubscription', () => {
    it('should call endpoint', () => {
      const invoiceId = 'a1-b2-c3-d4';
      const paymentMethodId = '1a-2b-3c-4d';
      const expectedUrl = `${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/payment_attempt/1-2-3`;
      const expectedBody = {
        invoice_id: invoiceId,
        payment_method_id: paymentMethodId,
      };

      service.retrySubscription(invoiceId, paymentMethodId).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('getSubscriptions', () => {
    it('should return the json from the categories and convert it into options', () => {
      const expectedUrl = `${environment.baseUrl}${SUBSCRIPTIONS_URL}`;
      service.subscriptions = null;
      let response: SubscriptionsResponse[];

      service.getSubscriptions(false).subscribe((res) => (response = res));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(SUBSCRIPTIONS);

      expect(req.request.url).toBe(expectedUrl);
      expect(response).toEqual(SUBSCRIPTIONS);
    });

    it('should map the mock consumer goods category when backend returns a subscription type with category as 0', () => {
      const expectedUrl = `${environment.baseUrl}${SUBSCRIPTIONS_URL}`;
      const subscriptionsWithConsumerGoods = [...SUBSCRIPTIONS, MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED];
      service.subscriptions = null;
      let response: SubscriptionsResponse[];

      service.getSubscriptions(false).subscribe((res) => (response = res));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(subscriptionsWithConsumerGoods);

      const subscriptionForConsumerGoods = response.find((subscription) => subscription.category_id === 0);
      const consumerGoodsCategory = categoryService.getConsumerGoodsCategory();
      expect(req.request.url).toBe(expectedUrl);
      expect(response).toEqual(subscriptionsWithConsumerGoods);
      expect(subscriptionForConsumerGoods.category_icon).toEqual(consumerGoodsCategory.icon_id);
      expect(subscriptionForConsumerGoods.category_id).toEqual(consumerGoodsCategory.category_id);
      expect(subscriptionForConsumerGoods.category_name).toEqual(consumerGoodsCategory.name);
    });

    it('should map discounts', () => {
      const expectedUrl = `${environment.baseUrl}${SUBSCRIPTIONS_URL}`;
      const nextDayAfterDiscountEndDate = 1000 * 60 * 60 * 24;
      service.subscriptions = null;
      let response: SubscriptionsResponse[];

      service.getSubscriptions(false).subscribe((res) => (response = res));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(SUBSCTIPTION_WITH_TIER_DISCOUNT);

      expect(req.request.url).toBe(expectedUrl);
      response[0].tiers.forEach((tier) => {
        expect(tier.discount.no_discount_date).toEqual(tier.discount.end_date + nextDayAfterDiscountEndDate);
      });
    });
  });

  describe('cancelSubscription', () => {
    it('should call the endpoint', () => {
      const planId = '1-2-3';
      const expectedUrl = `${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/cancel/${planId}`;

      service.cancelSubscription(planId).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('continueSubscription', () => {
    it('should call the endpoint', () => {
      const planId = '1-2-3';
      const expectedUrl = `${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/unsubscription/cancel/${planId}`;

      service.continueSubscription(planId).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('editSubscription', () => {
    it('should call the endpoint', () => {
      const planId = 'plan_FWuGNucr7WgWUc';
      const expectedUrl = `${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/${MAPPED_SUBSCRIPTIONS[2].id}`;

      service.editSubscription(MAPPED_SUBSCRIPTIONS[2], planId).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('getSlots', () => {
    it('should map slots from backend response', () => {
      let mappedSlots: SubscriptionSlot[];
      const expectedUrl = `${environment.baseUrl}${SUBSCRIPTIONS_SLOTS_ENDPOINT}`;

      service.getSlots().subscribe((response) => (mappedSlots = response));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_SUBSCRIPTION_SLOTS_GENERAL_RESPONSE);

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
      expect(mappedSlots).toEqual(MOCK_SUBSCRIPTION_SLOTS);
    });
  });

  describe('isSubscriptionInApp', () => {
    it('should be false when subscription is not subscribed', () => {
      expect(service.isSubscriptionInApp(MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED)).toBe(false);
    });

    it('should be false when subscription is from Stripe', () => {
      expect(service.isSubscriptionInApp(MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED)).toBe(false);
    });

    it('should be true when subscription was bought in Android or iOS', () => {
      expect(service.isSubscriptionInApp(MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_GOOGLE_PLAY_MAPPED)).toBe(true);
      expect(service.isSubscriptionInApp(MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_APPLE_STORE_MAPPED)).toBe(true);
    });
  });

  describe('isOneSubscriptionInApp', () => {
    it('should be false when all subscriptions are not subscribed', () => {
      expect(service.isOneSubscriptionInApp(SUBSCRIPTIONS_NOT_SUB)).toBe(false);
    });

    it('should be false when some subscriptions are from Stripe', () => {
      expect(service.isOneSubscriptionInApp(SUBSCRIPTIONS)).toBe(false);
    });

    it('should be true when some subscription were bought in Android or iOS', () => {
      expect(service.isOneSubscriptionInApp(MOCK_SUBSCRIPTIONS_WITH_ONE_GOOGLE_PLAY)).toBe(true);
      expect(service.isOneSubscriptionInApp(MOCK_SUBSCRIPTIONS_WITH_ONE_APPLE_STORE)).toBe(true);
    });
  });

  describe('isStripeSubscription', () => {
    it('should be false when subscription is not subscribed', () => {
      expect(service.isStripeSubscription(MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED)).toBe(false);
    });

    it('should be false when subscription was bought in Android or iOS', () => {
      expect(service.isStripeSubscription(MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_GOOGLE_PLAY_MAPPED)).toBe(false);
      expect(service.isStripeSubscription(MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_APPLE_STORE_MAPPED)).toBe(false);
    });

    it('should be true when subscription is from Stripe', () => {
      expect(service.isStripeSubscription(MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED)).toBe(true);
    });
  });

  describe('hasOneStripeSubscription', () => {
    it('should be false when all subscriptions are not subscribed', () => {
      expect(service.hasOneStripeSubscription(SUBSCRIPTIONS_NOT_SUB)).toBe(false);
    });

    it('should be false when some subscription were bought in Android or iOS', () => {
      expect(service.hasOneStripeSubscription(MOCK_SUBSCRIPTIONS_WITH_ONE_GOOGLE_PLAY)).toBe(false);
      expect(service.hasOneStripeSubscription(MOCK_SUBSCRIPTIONS_WITH_ONE_APPLE_STORE)).toBe(false);
    });

    it('should be true when some subscription are from Stripe', () => {
      expect(service.hasOneStripeSubscription(SUBSCRIPTIONS)).toBe(true);
    });
  });

  describe('getUserSubscriptionType', () => {
    describe('when user is a car dealer', () => {
      it('should say that user subscription type is car dealer', () => {
        spyOn(userService, 'isProfessional').and.returnValue(of(true));
        let result: SUBSCRIPTION_TYPES;

        service.getUserSubscriptionType().subscribe((response) => (result = response));
        httpMock.expectOne(`${environment.baseUrl}${SUBSCRIPTIONS_URL}`).flush({});

        expect(result).toEqual(SUBSCRIPTION_TYPES.carDealer);
      });
    });

    describe('when user has inapp subscriptions', () => {
      it('should say that user subscription type is inapp', () => {
        spyOn(userService, 'isProfessional').and.returnValue(of(false));
        let result: SUBSCRIPTION_TYPES;

        service.getUserSubscriptionType().subscribe((response) => (result = response));
        httpMock.expectOne(`${environment.baseUrl}${SUBSCRIPTIONS_URL}`).flush(MOCK_SUBSCRIPTIONS_WITH_ONE_GOOGLE_PLAY);

        expect(result).toEqual(SUBSCRIPTION_TYPES.inApp);
      });
    });

    describe('when user has Stripe subscriptions', () => {
      it('should say that user subscription type Stripe', () => {
        spyOn(userService, 'isProfessional').and.returnValue(of(false));
        let result: SUBSCRIPTION_TYPES;

        service.getUserSubscriptionType().subscribe((response) => (result = response));
        httpMock.expectOne(`${environment.baseUrl}${SUBSCRIPTIONS_URL}`).flush(SUBSCRIPTIONS);

        expect(result).toEqual(SUBSCRIPTION_TYPES.stripe);
      });
    });

    describe('when user has no subscriptions', () => {
      it('should say that user subscription type not subscribed', () => {
        spyOn(userService, 'isProfessional').and.returnValue(of(false));
        let result: SUBSCRIPTION_TYPES;

        service.getUserSubscriptionType().subscribe((response) => (result = response));
        httpMock.expectOne(`${environment.baseUrl}${SUBSCRIPTIONS_URL}`).flush(SUBSCRIPTIONS_NOT_SUB);

        expect(result).toEqual(SUBSCRIPTION_TYPES.notSubscribed);
      });
    });

    it('should cache the result by default', () => {
      spyOn(userService, 'isProfessional').and.returnValue(of(false));
      let result: SUBSCRIPTION_TYPES;
      let result2: SUBSCRIPTION_TYPES;

      service.getUserSubscriptionType().subscribe((response) => (result = response));
      httpMock.expectOne(`${environment.baseUrl}${SUBSCRIPTIONS_URL}`).flush(SUBSCRIPTIONS_NOT_SUB);
      service.getUserSubscriptionType().subscribe((response) => (result2 = response));
      httpMock.expectNone(`${environment.baseUrl}${SUBSCRIPTIONS_URL}`);

      expect(result).toBe(result2);
    });

    it('should bypass cache if not using cache', () => {
      spyOn(userService, 'isProfessional').and.returnValue(of(false));
      let result: SUBSCRIPTION_TYPES;
      let result2: SUBSCRIPTION_TYPES;

      service.getUserSubscriptionType().subscribe((response) => (result = response));
      httpMock.expectOne(`${environment.baseUrl}${SUBSCRIPTIONS_URL}`).flush(SUBSCRIPTIONS_NOT_SUB);
      service.getUserSubscriptionType(false).subscribe((response) => (result2 = response));
      httpMock.expectOne(`${environment.baseUrl}${SUBSCRIPTIONS_URL}`).flush(SUBSCRIPTIONS);

      expect(result).not.toBe(result2);
    });
  });

  describe('getTrialSubscriptionsIds', () => {
    describe('when has not any free trial', () => {
      it('should return no subscriptions', () => {
        const result = service.getTrialSubscriptionsIds(MAPPED_SUBSCRIPTIONS);

        expect(result).toEqual([]);
      });
    });

    describe('when has some free trial', () => {
      it('should return free trial subscriptions', () => {
        const result = service.getTrialSubscriptionsIds(MAPPED_SUBSCRIPTIONS_ADDED);

        expect(result).toEqual([14000]);
      });
    });

    describe('when subscriptions is not defined', () => {
      it('should return no subscriptions', () => {
        const result = service.getTrialSubscriptionsIds(undefined);

        expect(result).toEqual([]);
      });
    });
  });

  describe('hasFreeTrialByCategoryId', () => {
    describe('when category has free trial available', () => {
      it('should return true', () => {
        const result = service.hasFreeTrialByCategoryId(MAPPED_SUBSCRIPTIONS_ADDED, CATEGORY_IDS.MOTORBIKE);

        expect(result).toBe(true);
      });
    });

    describe('when category has not subscriptions ', () => {
      it('should return false', () => {
        const result = service.hasFreeTrialByCategoryId(MAPPED_SUBSCRIPTIONS_ADDED, CATEGORY_IDS.CELL_PHONES_ACCESSORIES);

        expect(result).toBe(false);
      });
    });

    describe('when category has not trial available', () => {
      it('should return no subscriptions', () => {
        const result = service.hasFreeTrialByCategoryId(MAPPED_SUBSCRIPTIONS_ADDED, CATEGORY_IDS.CAR);

        expect(result).toEqual(false);
      });
    });

    describe('when category has subscription activated', () => {
      it('should return no subscriptions', () => {
        const mockSubscriptions: SubscriptionsResponse[] = cloneDeep(MAPPED_SUBSCRIPTIONS_ADDED);
        mockSubscriptions[0].trial_available = true;
        const result = service.hasFreeTrialByCategoryId(mockSubscriptions, CATEGORY_IDS.MOTOR_ACCESSORIES);

        expect(result).toEqual(false);
      });
    });
  });

  describe('hasHighestLimit', () => {
    describe('when is selected tier without highest limit', () => {
      it('should return false', () => {
        const selectedSubscription: SubscriptionsResponse = cloneDeep(MAPPED_SUBSCRIPTIONS_ADDED[0]);
        selectedSubscription.selected_tier = MAPPED_SUBSCRIPTIONS_ADDED[0].tiers[0];

        const result = service.hasHighestLimit(selectedSubscription);

        expect(result).toEqual(false);
      });
    });

    describe('when is selected tier without limit', () => {
      it('should return false', () => {
        const selectedSubscription: SubscriptionsResponse = cloneDeep(MAPPED_SUBSCRIPTIONS_ADDED[0]);
        selectedSubscription.selected_tier = MAPPED_SUBSCRIPTIONS_ADDED[0].tiers[3];

        const result = service.hasHighestLimit(selectedSubscription);

        expect(result).toEqual(false);
      });
    });

    describe('when is selected tier with highest limit', () => {
      it('should return true', () => {
        const selectedSubscription: SubscriptionsResponse = cloneDeep(MAPPED_SUBSCRIPTIONS_ADDED[0]);
        selectedSubscription.selected_tier = MAPPED_SUBSCRIPTIONS_ADDED[0].tiers[2];

        const result = service.hasHighestLimit(selectedSubscription);

        expect(result).toEqual(true);
      });
    });
  });

  describe('get default tier discount', () => {
    describe('when has tiers with discount', () => {
      it('should return first tier with discount', () => {
        const selectedSubscription: SubscriptionsResponse = cloneDeep(MAPPED_SUBSCRIPTIONS_ADDED[0]);
        selectedSubscription.tiers[1].discount = TIER_DISCOUNT;

        const result = service.getDefaultTierDiscount(selectedSubscription);

        expect(result).toEqual(selectedSubscription.tiers[1]);
      });
    });

    describe('when has not any tier with discount', () => {
      it('should not return tier', () => {
        const selectedSubscription: SubscriptionsResponse = cloneDeep(MAPPED_SUBSCRIPTIONS_ADDED[0]);

        const result = service.getDefaultTierDiscount(selectedSubscription);

        expect(result).toBeFalsy();
      });
    });
  });

  describe('hasSomeSubscriptionDiscount', () => {
    describe('when has a subscription with tiers with discount', () => {
      it('should return tier with discount', () => {
        const subscriptions: SubscriptionsResponse[] = cloneDeep(MAPPED_SUBSCRIPTIONS_ADDED);
        subscriptions[0].tiers[1].discount = TIER_DISCOUNT;

        const result = service.hasSomeSubscriptionDiscount(subscriptions);

        expect(result).toEqual(true);
      });
    });

    describe('when has not a subscription with tiers with discount', () => {
      it('should return nothing', () => {
        const subscriptions: SubscriptionsResponse[] = cloneDeep(MAPPED_SUBSCRIPTIONS_ADDED);

        const result = service.hasSomeSubscriptionDiscount(subscriptions);

        expect(result).toEqual(false);
      });
    });
  });

  describe('getSubscriptionByCategory', () => {
    describe('when category is inside consumer goods subscription', () => {
      it('should return consumer goods subscription ', () => {
        const result = service.getSubscriptionByCategory(MAPPED_SUBSCRIPTIONS, CATEGORY_IDS.BIKES);

        expect(result).toEqual(
          MAPPED_SUBSCRIPTIONS.find((subscription) => subscription.category_id === CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS)
        );
      });
    });

    describe('when category is not inside consumer goods subscription', () => {
      it('should return subscription related to the category ', () => {
        const result = service.getSubscriptionByCategory(MAPPED_SUBSCRIPTIONS, CATEGORY_IDS.CAR);

        expect(result).toEqual(MAPPED_SUBSCRIPTIONS.find((subscription) => subscription.category_id === CATEGORY_SUBSCRIPTIONS_IDS.CAR));
      });
    });
  });

  describe('tierDiscountByCategoryId', () => {
    describe('when has a subscription id with tiers with discount', () => {
      it('should return tier with discount', () => {
        const subscriptions: SubscriptionsResponse[] = cloneDeep(MAPPED_SUBSCRIPTIONS);
        subscriptions[0].tiers[1].discount = TIER_DISCOUNT;

        const result = service.tierDiscountByCategoryId(subscriptions, subscriptions[0].category_id);

        expect(result).toEqual(subscriptions[0].tiers[1]);
      });
    });

    describe('when has not a subscription id with tiers with discount', () => {
      it('should return nothing', () => {
        const subscriptions: SubscriptionsResponse[] = cloneDeep(MAPPED_SUBSCRIPTIONS);
        subscriptions[0].tiers[1].discount = TIER_DISCOUNT;

        const result = service.tierDiscountByCategoryId(subscriptions, subscriptions[1].category_id);

        expect(result).toBeFalsy();
      });
    });
  });

  describe('getDefaultTierSubscriptionDiscount', () => {
    describe('when has a subscription tiers with discount', () => {
      it('should return tier with discount', () => {
        const subscriptions: SubscriptionsResponse[] = cloneDeep(MAPPED_SUBSCRIPTIONS);
        subscriptions[0].tiers[1].discount = TIER_DISCOUNT;

        const result = service.getDefaultTierSubscriptionDiscount(subscriptions);

        expect(result).toEqual(subscriptions[0].tiers[1]);
      });
    });

    describe('when has not a subscription id with tiers with discount', () => {
      it('should return nothing', () => {
        const subscriptions: SubscriptionsResponse[] = cloneDeep(MAPPED_SUBSCRIPTIONS);

        const result = service.getDefaultTierSubscriptionDiscount(subscriptions);

        expect(result).toBeFalsy();
      });
    });
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
