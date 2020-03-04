import { TestBed } from '@angular/core/testing';
import { SubscriptionsService, SUBSCRIPTIONS_URL } from './subscriptions.service';
import { Observable, of } from 'rxjs';
import { UserService } from '../user/user.service';
import { FeatureflagService, FEATURE_FLAGS_ENUM } from '../user/featureflag.service';
import { UUID } from 'angular2-uuid';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { HttpModuleNew } from '../http/http.module.new';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { CATEGORY_DATA_WEB } from '../../../tests/category.fixtures.spec';
import { SubscriptionsResponse } from './subscriptions.interface';
import { SUBSCRIPTIONS, MAPPED_SUBSCRIPTIONS, MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED } from '../../../tests/subscriptions.fixtures.spec';
import { CategoryService } from '../category/category.service';
import { AccessTokenService } from '../http/access-token.service';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../i18n/i18n.service';

describe('SubscriptionsService', () => {

  let service: SubscriptionsService;
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let userService: UserService;
  let featureflagService: FeatureflagService;
  let categoryService: CategoryService;
  const API_URL = 'api/v3/payments';
  const STRIPE_SUBSCRIPTION_URL = 'c2b/stripe/subscription';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpModuleNew],
      providers: [
        SubscriptionsService,
        {
          provide: AccessTokenService, useValue: {
            accessToken: 'ACCESS_TOKEN'
          }
        },
        {
          provide: UserService, useValue: {
            hasPerm() {
              return Observable.of(true);
            },
            me() {
              return Observable.of(MOCK_USER);
            }
          }
        },
        {
          provide: FeatureflagService, useValue: {
            getFlag() {
              return Observable.of(false);
            }
          }
        },
        CategoryService,
        I18nService
      ]
    });
    service = TestBed.get(SubscriptionsService);
    http = TestBed.get(HttpClient);
    httpMock = TestBed.get(HttpTestingController);
    userService = TestBed.get(UserService);
    featureflagService = TestBed.get(FeatureflagService);
    categoryService = TestBed.get(CategoryService);
    service.uuid = '1-2-3';
    spyOn(UUID, 'UUID').and.returnValue('1-2-3');
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
        product_subscription_id: subscriptionId
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
        payment_method_id: paymentMethodId
      };

      service.retrySubscription(invoiceId, paymentMethodId).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('isSubscriptionsActive', () => {
    it('should call featureflagService.getFlag when called', () => {
      spyOn(featureflagService, 'getFlag');

      service.isSubscriptionsActive$();

      expect(featureflagService.getFlag).toHaveBeenCalledWith(FEATURE_FLAGS_ENUM.SUBSCRIPTIONS);
    });
  });

  describe('getSubscriptions', () => {
    it('should return the json from the categories and convert it into options', () => {
      const expectedUrl = `${environment.baseUrl}${SUBSCRIPTIONS_URL}`;
      service.subscriptions = null;
      let response: SubscriptionsResponse[];

      service.getSubscriptions(false).subscribe((res) => response = res);
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

      service.getSubscriptions(false).subscribe((res) => response = res);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(subscriptionsWithConsumerGoods);

      const subscriptionForConsumerGoods = response.find(subscription => subscription.category_id === 0);
      const consumerGoodsCategory = categoryService.getConsumerGoodsCategory();
      expect(req.request.url).toBe(expectedUrl);
      expect(response).toEqual(subscriptionsWithConsumerGoods);
      expect(subscriptionForConsumerGoods.category_icon).toEqual(consumerGoodsCategory.icon_id);
      expect(subscriptionForConsumerGoods.category_id).toEqual(consumerGoodsCategory.category_id);
      expect(subscriptionForConsumerGoods.category_name).toEqual(consumerGoodsCategory.name);
    })
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

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
