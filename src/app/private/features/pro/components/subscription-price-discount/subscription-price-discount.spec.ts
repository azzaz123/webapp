import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import {
  MAPPED_SUBSCRIPTIONS,
  MAPPED_SUBSCRIPTIONS_ADDED,
  MockSubscriptionService,
  TIER_DISCOUNT,
} from '@fixtures/subscriptions.fixtures.spec';
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

  describe('has discount', () => {
    beforeEach(() => {
      spyOn(subscriptionsService, 'getDefaultDiscount').and.returnValue(TIER_DISCOUNT);
      component.ngOnInit();
      fixture.detectChanges();
    });
    it('should show price discounted', () => {
      const discountLabel: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionPriceDiscount__price--discounted')).nativeElement;
      expect(discountLabel).toBeTruthy();
      expect(discountLabel.innerHTML).toContain(component.subscription?.tiers[0]?.price);
    });
    it('should show discount', () => {
      const discountLabel: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionPriceDiscount')).nativeElement;
      expect(discountLabel).toBeTruthy();
      expect(discountLabel.innerHTML).toContain(component.discount.price);
    });
  });

  describe('has not discount', () => {
    it('should not show discount', () => {
      spyOn(subscriptionsService, 'getDefaultDiscount').and.callThrough();

      component.ngOnInit();
      fixture.detectChanges();

      const discountLabel = fixture.debugElement.query(By.css('.SubscriptionPriceDiscount__price--discounted'));
      expect(discountLabel).toBeFalsy();
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
