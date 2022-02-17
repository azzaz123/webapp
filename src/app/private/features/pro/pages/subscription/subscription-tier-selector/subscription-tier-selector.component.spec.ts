import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { cloneDeep } from 'lodash-es';
import {
  FREE_TRIAL_AVAILABLE_NO_DISCOUNTS_SUBSCRIPTION,
  FREE_TRIAL_AVAILABLE_SUBSCRIPTION,
  MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED_NO_DISCOUNTS,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED,
  MOCK_TIER_2_WITH_DISCOUNT_WITH_ZONE_BUMP,
  TIER_DISCOUNT,
} from '@fixtures/subscriptions.fixtures.spec';

import { SubscriptionTierSelectorComponent } from './subscription-tier-selector.component';

describe('SubscriptionTierSelectorComponent', () => {
  let component: SubscriptionTierSelectorComponent;
  let fixture: ComponentFixture<SubscriptionTierSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionTierSelectorComponent],
      schemas: [NO_ERRORS_SCHEMA],
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
    describe('is basic tier', () => {
      beforeEach(() => {
        component.subscription = MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED;
        fixture.detectChanges();
      });
      it('should show basic title', () => {
        const tierTitle = fixture.debugElement.queryAll(By.css('.Card'))[0].query(By.css('.Card__title')).nativeElement;

        expect(tierTitle.textContent).toBe($localize`:@@pro_subscription_purchase_non_subscribed_users_cg_basic_plan_title:Basic`);
      });
      it('should show limit subtitle', () => {
        const tierTitle = fixture.debugElement.queryAll(By.css('.Card'))[0].query(By.css('.GenericCard__subtitle')).nativeElement;

        expect(tierTitle.textContent).toBe(
          $localize`:@@pro_subscription_purchase_subscription_details_list_tier_text:Manage up to ${component.subscription.tiers[0].limit}:INTERPOLATION: items`
        );
      });
    });
    describe('has limits', () => {
      it('should show limit into title', () => {
        const tierTitle = fixture.debugElement.queryAll(By.css('.Card'))[0].query(By.css('.Card__title')).nativeElement;

        expect(tierTitle.textContent).toContain(component.subscription.tiers[0].limit);
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

  describe('Benefits', () => {
    describe('has bumps', () => {
      beforeEach(() => {
        component.subscription = cloneDeep(FREE_TRIAL_AVAILABLE_NO_DISCOUNTS_SUBSCRIPTION);
        component.subscription.tiers[0] = MOCK_TIER_2_WITH_DISCOUNT_WITH_ZONE_BUMP;
        component.selectedTier = component.subscription.tiers[0];
        fixture.detectChanges();
      });
      it('should show bumps data', () => {
        const tier = component.subscription.tiers[0];
        const tierBenefit = fixture.debugElement
          .queryAll(By.css('.Card'))[0]
          .query(By.css('.Card__benefits--large'))
          .queryAll(By.css('div'));
        const expectBenefit = $localize`:@@pro_subscription_purchase_subscription_details_list_tier_text:Manage up to ${tier.limit}:INTERPOLATION: items`;

        expect(tierBenefit[0].nativeElement.textContent).toEqual(`${expectBenefit}`);
      });
      it('should show limit data', () => {
        const tier = component.subscription.tiers[0];
        const tierBenefit = fixture.debugElement
          .queryAll(By.css('.Card'))[0]
          .query(By.css('.Card__benefits--large'))
          .queryAll(By.css('div'));
        const expectBenefit = $localize`:@@pro_subscription_purchase_subscription_details_list_monthly_bumps_text:Highlight ${tier.bumps[0].quantity} items monthly (duration: ${tier.bumps[0].duration_days} days)`;

        expect(tierBenefit[1].nativeElement.textContent).toEqual(`${expectBenefit}`);
      });
    });
    describe('has not bumps', () => {
      beforeEach(() => {
        component.subscription = FREE_TRIAL_AVAILABLE_NO_DISCOUNTS_SUBSCRIPTION;
        component.selectedTier = FREE_TRIAL_AVAILABLE_NO_DISCOUNTS_SUBSCRIPTION.tiers[0];
        fixture.detectChanges();
      });
      it('should show limit data', () => {
        const tier = component.subscription.tiers[0];
        const tierBenefit = fixture.debugElement.queryAll(By.css('.Card'))[0].query(By.css('.Card__benefits')).nativeElement;
        const expectBenefit = $localize`:@@pro_subscription_purchase_subscription_details_list_tier_text:Manage up to ${tier.limit}:INTERPOLATION: items`;

        expect(tierBenefit.textContent).toEqual(`${expectBenefit}`);
      });
    });
  });
});
