import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { MAPPED_SUBSCRIPTIONS, MAPPED_SUBSCRIPTIONS_ADDED, MockSubscriptionService } from '@fixtures/subscriptions.fixtures.spec';
import { SubscriptionPriceDiscountComponent } from './subscription-price-discount.component';

describe('SubscriptionPriceDiscountComponent', () => {
  let component: SubscriptionPriceDiscountComponent;
  let fixture: ComponentFixture<SubscriptionPriceDiscountComponent>;
  let subscriptionsService: SubscriptionsService;
  const componentInstance = { subscription: MAPPED_SUBSCRIPTIONS[0] };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SubscriptionPriceDiscountComponent],
        providers: [{ provide: SubscriptionsService, useClass: MockSubscriptionService }],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPriceDiscountComponent);
    component = fixture.componentInstance;
    subscriptionsService = TestBed.inject(SubscriptionsService);
    component.subscription = MAPPED_SUBSCRIPTIONS_ADDED[2];
    fixture.detectChanges();
  });

  describe('hasTrial', () => {
    it('should return if the subscription has a trial available', () => {
      spyOn(subscriptionsService, 'hasTrial').and.returnValue(MAPPED_SUBSCRIPTIONS_ADDED[2].trial_available);

      component.hasTrial(MAPPED_SUBSCRIPTIONS_ADDED[2]);

      expect(subscriptionsService.hasTrial).toHaveBeenCalledWith(MAPPED_SUBSCRIPTIONS_ADDED[2]);
    });
  });

  describe('hasOneTierDiscount', () => {
    it('should return if the subscription has a hasOneTierDiscount', () => {
      spyOn(subscriptionsService, 'hasOneTierDiscount').and.callThrough();

      component.hasOneTierDiscount(MAPPED_SUBSCRIPTIONS_ADDED[2]);

      expect(subscriptionsService.hasOneTierDiscount).toHaveBeenCalledWith(MAPPED_SUBSCRIPTIONS_ADDED[2]);
    });
  });

  describe('hasOneFreeTier', () => {
    it('should return if the subscription has a freeTier', () => {
      spyOn(subscriptionsService, 'hasOneFreeTier').and.callThrough();

      component.hasOneFreeTier(MAPPED_SUBSCRIPTIONS_ADDED[2]);

      expect(subscriptionsService.hasOneFreeTier).toHaveBeenCalledWith(MAPPED_SUBSCRIPTIONS_ADDED[2]);
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
