import { TestBed } from '@angular/core/testing';
import { SubscriptionsService } from './subscriptions.service';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { UserService } from '../user/user.service';
import { FeatureflagService } from '../user/featureflag.service';
import { UUID } from 'angular2-uuid';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';

describe('SubscriptionsService', () => {

  let service: SubscriptionsService;
  let http: HttpService;
  let userService: UserService;
  let featureflagService: FeatureflagService;
  const API_URL = 'api/v3/payments';
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_HTTP_PROVIDERS,
        SubscriptionsService,
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
        }
      ]
    });
    service = TestBed.get(SubscriptionsService);
    http = TestBed.get(HttpService);
    userService = TestBed.get(UserService);
    featureflagService = TestBed.get(FeatureflagService);
    service.uuid = '1-2-3';
    spyOn(UUID, 'UUID').and.returnValue('1-2-3');
  });


  afterEach(() => {
    TestBed.resetTestingModule();
  });
  
  describe('newSubscription', () => {
    it('should call endpoint', () => {
      spyOn(http, 'post').and.returnValue(Observable.of({}));
      const paymentId = 'a1-b2-c3-d4';
      const subscriptionId = '1a-2b-3c-4d';
  
      service.newSubscription(subscriptionId, paymentId).subscribe();
  
      expect(http.post).toHaveBeenCalledWith(`${API_URL}/c2b/stripe/subscription/1-2-3`, {
        payment_method_id: paymentId,
        product_subscription_id: subscriptionId
      });
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });
  });

  describe('checkNewSubscriptionStatus', () => {    
    it('should call endpoint', () => {
      spyOn(http, 'get').and.callThrough();
  
      service.checkNewSubscriptionStatus().subscribe();
  
      expect(http.get).toHaveBeenCalledWith(`${API_URL}/c2b/stripe/subscription/1-2-3`);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });
  });

  describe('checkRetrySubscriptionStatus', () => {    
    it('should call endpoint', () => {
      spyOn(http, 'get').and.callThrough();
  
      service.checkRetrySubscriptionStatus().subscribe();
  
      expect(http.get).toHaveBeenCalledWith(`${API_URL}/c2b/stripe/subscription/payment_attempt/1-2-3`);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });
  });

  describe('retrySubscription', () => {
    it('should call endpoint', () => {
      spyOn(http, 'put').and.callThrough();
      const invoiceId = 'a1-b2-c3-d4';
      const paymentMethodId = '1a-2b-3c-4d';
  
      service.retrySubscription(invoiceId, paymentMethodId).subscribe();
  
      expect(http.put).toHaveBeenCalledWith(`${API_URL}/c2b/stripe/subscription/payment_attempt/1-2-3`, {
        invoice_id: invoiceId,
        payment_method_id: paymentMethodId
      });
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });
  });

  describe('isSubscriptionsActive', () => {
    it('should call featureflagService.getFlag when called', () => {
      spyOn(featureflagService, 'getFlag');
  
      service.isSubscriptionsActive$();
  
      expect(featureflagService.getFlag).toHaveBeenCalledWith('web_subscriptions');
    });
  
    afterEach(() => {
      TestBed.resetTestingModule();
    });
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
  
});