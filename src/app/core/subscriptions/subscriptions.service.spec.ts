import { TestBed } from '@angular/core/testing';
import { SubscriptionsService, SUBSCRIPTION_TYPES } from './subscriptions.service';
import { of } from 'rxjs';
import { UserService } from '../user/user.service';
import { FeatureFlagService } from '../user/featureflag.service';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { CATEGORY_DATA_WEB } from '../../../tests/category.fixtures.spec';
import { SubscriptionsResponse } from './subscriptions.interface';
import {
  SUBSCRIPTIONS,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED,
  SUBSCRIPTIONS_NOT_SUB,
  TIER_DISCOUNT,
  MOCK_RESPONSE_V3_SUBSCRIPTIONS,
  MOCK_V3_MAPPED_SUBSCRIPTIONS,
  MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED_NO_DISCOUNTS,
  MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED,
  SUBSCRIPTIONS_WITH_ONE_FREE_TRIAL,
  MOCK_SUBSCRIPTION_CARS_WITH_LIMITS,
  MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED,
} from '../../../tests/subscriptions.fixtures.spec';
import { CategoryService } from '../category/category.service';
import { AccessTokenService } from '../http/access-token.service';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../i18n/i18n.service';
import { UuidService } from '../uuid/uuid.service';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { cloneDeep } from 'lodash-es';
import { CATEGORY_SUBSCRIPTIONS_IDS } from './category-subscription-ids';
import { SubscriptionsHttpService } from './http/subscriptions-http.service';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let userService: UserService;
  let subscriptionsHttpService: SubscriptionsHttpService;
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
        SubscriptionsHttpService,
      ],
    });
    service = TestBed.inject(SubscriptionsService);
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    categoryService = TestBed.inject(CategoryService);
    uuidService = TestBed.inject(UuidService);
    subscriptionsHttpService = TestBed.inject(SubscriptionsHttpService);
    service.uuid = '1-2-3';
    spyOn(uuidService, 'getUUID').and.returnValue('1-2-3');
    spyOn(categoryService, 'getCategories').and.returnValue(of(CATEGORY_DATA_WEB));
    spyOn(subscriptionsHttpService, 'get').and.returnValue(of(MOCK_RESPONSE_V3_SUBSCRIPTIONS));
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
    it('should return subscriptions formatted', () => {
      let response: SubscriptionsResponse[];

      service.getSubscriptions(false).subscribe((res) => (response = res));

      expect(subscriptionsHttpService.get).toHaveBeenCalledTimes(1);
      expect(subscriptionsHttpService.get).toHaveBeenCalledWith();
      expect(response).toEqual(MOCK_V3_MAPPED_SUBSCRIPTIONS);
    });
    describe('and is cache disabled', () => {
      it('should call http service', () => {
        let response: SubscriptionsResponse[];

        service.getSubscriptions(false).subscribe((res) => (response = res));
        service.getSubscriptions(false).subscribe((res) => (response = res));

        expect(subscriptionsHttpService.get).toHaveBeenCalledTimes(2);
        expect(subscriptionsHttpService.get).toHaveBeenCalledWith();
        expect(response).toEqual(MOCK_V3_MAPPED_SUBSCRIPTIONS);
      });
    });
    describe('and is cache enabled', () => {
      it('should call http service', () => {
        let response: SubscriptionsResponse[];

        service.getSubscriptions(false).subscribe((res) => (response = res));
        service.getSubscriptions(true).subscribe((res) => (response = res));

        expect(subscriptionsHttpService.get).toHaveBeenCalledTimes(1);
        expect(subscriptionsHttpService.get).toHaveBeenCalledWith();
        expect(response).toEqual(MOCK_V3_MAPPED_SUBSCRIPTIONS);
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
      const expectedUrl = `${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/${MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED.id}`;

      service.editSubscription(MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED, planId).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('isStripeSubscription', () => {
    it('should be false when subscription is not subscribed', () => {
      expect(service.isStripeSubscription(MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED)).toBe(false);
    });

    it('should be true when subscription is from Stripe', () => {
      expect(service.isStripeSubscription(MOCK_SUBSCRIPTION_CONSUMER_GOODS_SUBSCRIBED_MAPPED)).toBe(true);
    });
  });

  describe('hasOneStripeSubscription', () => {
    it('should be false when all subscriptions are not subscribed', () => {
      expect(service.hasOneStripeSubscription(SUBSCRIPTIONS_NOT_SUB)).toBe(false);
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

        expect(result).toEqual(SUBSCRIPTION_TYPES.carDealer);
      });
    });

    describe('when user has Stripe subscriptions', () => {
      it('should say that user subscription type Stripe', () => {
        spyOn(userService, 'isProfessional').and.returnValue(of(false));
        spyOn(service, 'getSubscriptions').and.returnValue(of(SUBSCRIPTIONS));
        let result: SUBSCRIPTION_TYPES;

        service.getUserSubscriptionType().subscribe((response) => (result = response));

        expect(result).toEqual(SUBSCRIPTION_TYPES.stripe);
      });
    });

    describe('when user has no subscriptions', () => {
      it('should say that user subscription type not subscribed', () => {
        spyOn(userService, 'isProfessional').and.returnValue(of(false));
        spyOn(service, 'getSubscriptions').and.returnValue(of(SUBSCRIPTIONS_NOT_SUB));
        let result: SUBSCRIPTION_TYPES;

        service.getUserSubscriptionType().subscribe((response) => (result = response));

        expect(result).toEqual(SUBSCRIPTION_TYPES.notSubscribed);
      });
    });

    it('should cache the result by default', () => {
      spyOn(userService, 'isProfessional').and.returnValue(of(false));
      spyOn(service, 'getSubscriptions').and.returnValue(of(SUBSCRIPTIONS));
      let result: SUBSCRIPTION_TYPES;
      let result2: SUBSCRIPTION_TYPES;

      service.getUserSubscriptionType().subscribe((response) => (result = response));
      service.getUserSubscriptionType().subscribe((response) => (result2 = response));

      expect(result).toBe(result2);
      expect(service.getSubscriptions).toBeCalledTimes(1);
    });

    it('should bypass cache if not using cache', () => {
      spyOn(userService, 'isProfessional').and.returnValue(of(false));
      spyOn(service, 'getSubscriptions').and.returnValues(of(SUBSCRIPTIONS_NOT_SUB), of(SUBSCRIPTIONS));
      let result: SUBSCRIPTION_TYPES;
      let result2: SUBSCRIPTION_TYPES;

      service.getUserSubscriptionType().subscribe((response) => (result = response));
      service.getUserSubscriptionType(false).subscribe((response) => (result2 = response));

      expect(service.getSubscriptions).toBeCalledTimes(2);
      expect(result).not.toBe(result2);
    });
  });

  describe('getTrialSubscriptionsIds', () => {
    describe('when has not any free trial', () => {
      it('should return no subscriptions', () => {
        const result = service.getTrialSubscriptionsIds(SUBSCRIPTIONS);

        expect(result).toEqual([]);
      });
    });

    describe('when has some free trial', () => {
      it('should return free trial subscriptions', () => {
        const result = service.getTrialSubscriptionsIds(SUBSCRIPTIONS_WITH_ONE_FREE_TRIAL);

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
        const result = service.hasFreeTrialByCategoryId(SUBSCRIPTIONS_WITH_ONE_FREE_TRIAL, CATEGORY_IDS.MOTORBIKE);

        expect(result).toBe(true);
      });
    });

    describe('when category has not subscriptions ', () => {
      it('should return false', () => {
        const result = service.hasFreeTrialByCategoryId(SUBSCRIPTIONS, CATEGORY_IDS.CELL_PHONES_ACCESSORIES);

        expect(result).toBe(false);
      });
    });

    describe('when category has not trial available', () => {
      it('should return no subscriptions', () => {
        const result = service.hasFreeTrialByCategoryId(SUBSCRIPTIONS_WITH_ONE_FREE_TRIAL, CATEGORY_IDS.CAR);

        expect(result).toEqual(false);
      });
    });

    describe('when category has subscription activated', () => {
      it('should return no subscriptions', () => {
        const mockSubscriptions: SubscriptionsResponse[] = cloneDeep(SUBSCRIPTIONS);
        mockSubscriptions[0].trial_available = true;
        const result = service.hasFreeTrialByCategoryId(mockSubscriptions, CATEGORY_IDS.MOTOR_ACCESSORIES);

        expect(result).toEqual(false);
      });
    });
  });

  describe('hasHighestLimit', () => {
    describe('when is selected tier without highest limit', () => {
      it('should return false', () => {
        const selectedSubscription: SubscriptionsResponse = cloneDeep(MOCK_SUBSCRIPTION_CARS_WITH_LIMITS);
        selectedSubscription.selected_tier = MOCK_SUBSCRIPTION_CARS_WITH_LIMITS.tiers[0];

        const result = service.hasHighestLimit(selectedSubscription);

        expect(result).toEqual(false);
      });
    });

    describe('when is selected tier without limit', () => {
      it('should return false', () => {
        const selectedSubscription: SubscriptionsResponse = cloneDeep(MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED);
        selectedSubscription.selected_tier = MOCK_SUBSCRIPTION_CARS_WITH_LIMITS.tiers[1];

        const result = service.hasHighestLimit(selectedSubscription);

        expect(result).toEqual(false);
      });
    });

    describe('when is selected tier with highest limit', () => {
      it('should return true', () => {
        const selectedSubscription: SubscriptionsResponse = cloneDeep(MOCK_SUBSCRIPTION_CARS_WITH_LIMITS);
        selectedSubscription.selected_tier = MOCK_SUBSCRIPTION_CARS_WITH_LIMITS.tiers[1];

        const result = service.hasHighestLimit(selectedSubscription);

        expect(result).toEqual(true);
      });
    });
  });

  describe('get default tier discount', () => {
    describe('when has tiers with discount', () => {
      it('should return first tier with discount', () => {
        const selectedSubscription: SubscriptionsResponse = cloneDeep(SUBSCRIPTIONS[0]);
        selectedSubscription.tiers[0].discount = null;

        const result = service.getDefaultTierDiscount(selectedSubscription);

        expect(result).toEqual(selectedSubscription.tiers[1]);
      });
    });

    describe('when has not any tier with discount', () => {
      it('should not return tier', () => {
        const selectedSubscription: SubscriptionsResponse = cloneDeep(MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED_NO_DISCOUNTS);

        const result = service.getDefaultTierDiscount(selectedSubscription);

        expect(result).toBeFalsy();
      });
    });
  });

  describe('hasSomeSubscriptionDiscount', () => {
    describe('when has a subscription with tiers with discount', () => {
      it('should return tier with discount', () => {
        const subscriptions: SubscriptionsResponse[] = cloneDeep(SUBSCRIPTIONS);
        subscriptions[0].tiers[1].discount = TIER_DISCOUNT;

        const result = service.hasSomeSubscriptionDiscount(subscriptions);

        expect(result).toEqual(true);
      });
    });

    describe('when has not a subscription with tiers with discount', () => {
      it('should return nothing', () => {
        const subscriptions: SubscriptionsResponse[] = cloneDeep([
          MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED_NO_DISCOUNTS,
          MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED_NO_DISCOUNTS,
        ]);

        const result = service.hasSomeSubscriptionDiscount(subscriptions);

        expect(result).toEqual(false);
      });
    });
  });

  describe('getSubscriptionByCategory', () => {
    describe('when category is inside consumer goods subscription', () => {
      it('should return consumer goods subscription ', () => {
        const result = service.getSubscriptionByCategory(SUBSCRIPTIONS, CATEGORY_IDS.BIKES);

        expect(result).toEqual(
          SUBSCRIPTIONS.find((subscription) => subscription.category_id === CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS)
        );
      });
    });

    describe('when category is not inside consumer goods subscription', () => {
      it('should return subscription related to the category ', () => {
        const result = service.getSubscriptionByCategory(SUBSCRIPTIONS, CATEGORY_IDS.CAR);

        expect(result).toEqual(SUBSCRIPTIONS.find((subscription) => subscription.category_id === CATEGORY_SUBSCRIPTIONS_IDS.CAR));
      });
    });
  });

  describe('tierDiscountByCategoryId', () => {
    describe('when has a subscription id with tiers with discount', () => {
      it('should return tier with discount', () => {
        const subscriptions: SubscriptionsResponse[] = cloneDeep(SUBSCRIPTIONS);
        subscriptions[0].tiers[0].discount = null;

        const result = service.tierDiscountByCategoryId(subscriptions, subscriptions[0].category_id);

        expect(result).toEqual(subscriptions[0].tiers[1]);
      });
    });

    describe('when has not a subscription id with tiers with discount', () => {
      it('should return nothing', () => {
        const subscriptions: SubscriptionsResponse[] = cloneDeep(SUBSCRIPTIONS_WITH_ONE_FREE_TRIAL);

        const result = service.tierDiscountByCategoryId(subscriptions, subscriptions[2].category_id);

        expect(result).toBeFalsy();
      });
    });
  });

  describe('getDefaultTierSubscriptionDiscount', () => {
    describe('when has a subscription tiers with discount', () => {
      it('should return tier with discount', () => {
        const subscriptions: SubscriptionsResponse[] = cloneDeep(SUBSCRIPTIONS);
        subscriptions[0].tiers[0].discount = null;

        const result = service.getDefaultTierSubscriptionDiscount(subscriptions);

        expect(result).toEqual(subscriptions[0].tiers[1]);
      });
    });

    describe('when has not a subscription id with tiers with discount', () => {
      it('should return nothing', () => {
        const subscriptions: SubscriptionsResponse[] = cloneDeep([MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED_NO_DISCOUNTS]);

        const result = service.getDefaultTierSubscriptionDiscount(subscriptions);

        expect(result).toBeFalsy();
      });
    });
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
