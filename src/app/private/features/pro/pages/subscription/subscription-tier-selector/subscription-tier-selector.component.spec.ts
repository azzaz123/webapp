import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  FREE_TRIAL_AVAILABLE_NO_DISCOUNTS_SUBSCRIPTION,
  FREE_TRIAL_AVAILABLE_SUBSCRIPTION,
  MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED_NO_DISCOUNTS,
  MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED,
  TIER_DISCOUNT,
} from '@fixtures/subscriptions.fixtures.spec';

import { SubscriptionTierSelectorComponent } from './subscription-tier-selector.component';

describe('SubscriptionTierSelectorComponent', () => {
  let component: SubscriptionTierSelectorComponent;
  let fixture: ComponentFixture<SubscriptionTierSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionTierSelectorComponent],
    })
      .overrideComponent(SubscriptionTierSelectorComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionTierSelectorComponent);
    component = fixture.componentInstance;
    component.subscription = MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED_NO_DISCOUNTS;
    component.selectedTier = MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED_NO_DISCOUNTS.tiers[0];
    fixture.detectChanges();
  });

  describe('Tiers', () => {
    it('should show tiers', () => {
      const tiers = fixture.debugElement.queryAll(By.css('.Card'));

      expect(tiers.length).toEqual(component.subscription.tiers.length);
    });

    describe('click on tier', () => {
      beforeEach(() => {
        spyOn(component.changeSelectedTier, 'emit');
      });
      it('should emit click', () => {
        fixture.debugElement.queryAll(By.css('.Card'))[0].nativeElement.click();

        expect(component.changeSelectedTier.emit).toHaveBeenCalledTimes(1);
        expect(component.changeSelectedTier.emit).toHaveBeenCalledWith(component.subscription.tiers[0]);
      });
    });

    describe('has selected tier', () => {
      it('should show card as selected', () => {
        const tiersSelected = fixture.debugElement.queryAll(By.css('.Card--selected'));

        expect(tiersSelected.length).toEqual(1);
        expect(tiersSelected[0].nativeElement.textContent).toContain(component.selectedTier.price);
      });
    });
  });

  describe('Title', () => {
    describe('has limits', () => {
      describe('and is real estate', () => {
        beforeEach(() => {
          component.subscription = MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED;
          fixture.detectChanges();
        });
        it('should show title', () => {
          const tierTitle = fixture.debugElement.queryAll(By.css('.Card'))[0].query(By.css('.Card__title')).nativeElement;

          expect(tierTitle.textContent).toBe(
            $localize`:@@web_profile_pages_subscription_332:List up to ${component.subscription.selected_tier.limit} real estate`
          );
        });
      });

      describe('and is not real estate', () => {
        it('should show title', () => {
          const tierTitle = fixture.debugElement.queryAll(By.css('.Card'))[0].query(By.css('.Card__title')).nativeElement;

          expect(tierTitle.textContent).toBe(
            $localize`:@@web_profile_pages_subscription_325:List up to ${component.subscription.tiers[0].limit} items`
          );
        });
      });
    });

    describe('has not limits', () => {
      beforeEach(() => {
        component.subscription = FREE_TRIAL_AVAILABLE_NO_DISCOUNTS_SUBSCRIPTION;
        fixture.detectChanges();
      });
      it('should show title', () => {
        const tierTitle = fixture.debugElement.queryAll(By.css('.Card'))[1].query(By.css('.Card__title')).nativeElement;

        expect(tierTitle.textContent).toBe($localize`:@@web_profile_pages_subscription_586:List without limits`);
      });
    });
  });

  describe('Description', () => {
    describe('has free trial', () => {
      beforeEach(() => {
        component.subscription = FREE_TRIAL_AVAILABLE_NO_DISCOUNTS_SUBSCRIPTION;
        component.selectedTier = FREE_TRIAL_AVAILABLE_NO_DISCOUNTS_SUBSCRIPTION.tiers[0];
        fixture.detectChanges();
      });
      it('should show description with trial', () => {
        const tierTitle = fixture.debugElement.queryAll(By.css('.Card'))[0].query(By.css('.Card__description')).nativeElement;
        const expectedMonthlyPriceText = $localize`:@@web_profile_pages_subscription_326:${component.subscription.tiers[0].price}:INTERPOLATION:${component.subscription.tiers[0].currency}:INTERPOLATION:/month`;
        const expectedFreeTrialText = $localize`:@@after_free_trial:after free trial`;

        expect(tierTitle.textContent).toEqual(`${expectedMonthlyPriceText} ${expectedFreeTrialText}`);
      });
    });

    describe('has not free trial', () => {
      describe('and has no discount', () => {
        it('should show description', () => {
          const tierDescription = fixture.debugElement.queryAll(By.css('.Card'))[0].query(By.css('.Card__description'));
          const tierDescriptionText = tierDescription.nativeElement.textContent;
          const classDiscounted = tierDescription.query(By.css('.Card__description--discounted'));
          const expectedText = $localize`:@@web_profile_pages_subscription_326:${component.selectedTier.price}:INTERPOLATION:${component.selectedTier.currency}:INTERPOLATION:/month`;

          expect(tierDescriptionText).toBe(expectedText);
          expect(classDiscounted).toBeFalsy();
        });
      });
      describe('and has discount', () => {
        beforeEach(() => {
          component.subscription.tiers[0].discount = TIER_DISCOUNT;
          component.selectedTier = FREE_TRIAL_AVAILABLE_SUBSCRIPTION.tiers[0];
          fixture.detectChanges();
        });
        it('should show description with discount', () => {
          const tier = component.subscription.tiers[0];
          const tierDescription = fixture.debugElement.queryAll(By.css('.Card'))[0].query(By.css('.Card__description'));
          const tierDescriptionText = tierDescription.nativeElement.textContent;
          const classDiscounted = tierDescription.query(By.css('.Card__description--discounted'));

          const expectedMonthlyPriceText = $localize`:@@web_profile_pages_subscription_326:${tier.discount.price}:INTERPOLATION:${tier.currency}:INTERPOLATION:/month`;
          const expectedDateText = $localize`:@@pro_subscription_purchase_tier_list_discount_limit_date_label:Enjoy the discount until ${new DatePipe(
            'en'
          ).transform(tier.discount.end_date, 'dd/MM/yy')}:INTERPOLATION:`;

          expect(tierDescriptionText).toEqual(`${tier.price}${expectedMonthlyPriceText} ${expectedDateText}`);
          expect(classDiscounted).toBeTruthy();
        });
      });
    });
  });
});
