import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED, TIER_WITH_DISCOUNT } from '@fixtures/subscriptions.fixtures.spec';
import { SubscriptionPriceDiscountComponent } from './subscription-price-discount.component';

describe('SubscriptionPriceDiscountComponent', () => {
  let component: SubscriptionPriceDiscountComponent;
  let fixture: ComponentFixture<SubscriptionPriceDiscountComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SubscriptionPriceDiscountComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPriceDiscountComponent);
    component = fixture.componentInstance;
    component.subscription = MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED;
    fixture.detectChanges();
  });

  describe('has discount', () => {
    beforeEach(() => {
      component.tierDiscount = TIER_WITH_DISCOUNT;
      fixture.detectChanges();
    });
    it('should show price discounted', () => {
      const discountLabel: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionPriceDiscount__price--discounted')).nativeElement;
      expect(discountLabel).toBeTruthy();
      expect(discountLabel.innerHTML).toContain(TIER_WITH_DISCOUNT.price);
    });
    it('should show discount', () => {
      const discountLabel: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionPriceDiscount')).nativeElement;
      expect(discountLabel).toBeTruthy();
      expect(discountLabel.innerHTML).toContain(TIER_WITH_DISCOUNT.discount.price);
    });
  });

  describe('has not discount', () => {
    it('should not show discount', () => {
      component.tierDiscount = null;

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
