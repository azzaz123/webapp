import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  FREE_TRIAL_AVAILABLE_SUBSCRIPTION,
  MAPPED_SUBSCRIPTIONS,
  MAPPED_SUBSCRIPTIONS_WITH_RE,
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
    component.subscription = MAPPED_SUBSCRIPTIONS[0];
    component.selectedTier = MAPPED_SUBSCRIPTIONS[0].tiers[0];
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
          component.subscription = MAPPED_SUBSCRIPTIONS_WITH_RE[0];
          fixture.detectChanges();
        });
        it('should show title', () => {
          const tierTitle = fixture.debugElement.queryAll(By.css('.Card'))[0].query(By.css('.Card__title')).nativeElement;

          expect(tierTitle.textContent).toContain(
            $localize`:@@web_profile_pages_subscription_332:List up to ${component.subscription.selected_tier.limit} real estate`
          );
        });
      });

      describe('and is not real estate', () => {
        it('should show title', () => {
          const tierTitle = fixture.debugElement.queryAll(By.css('.Card'))[0].query(By.css('.Card__title')).nativeElement;

          expect(tierTitle.textContent).toContain(
            $localize`:@@web_profile_pages_subscription_325:List up to ${component.subscription.tiers[0].limit} items`
          );
        });
      });
    });

    describe('has not limits', () => {
      it('should show title', () => {
        const tierTitle = fixture.debugElement.queryAll(By.css('.Card'))[3].query(By.css('.Card__title')).nativeElement;

        expect(tierTitle.textContent).toContain($localize`:@@web_profile_pages_subscription_586:List without limits`);
      });
    });
  });

  describe('Description', () => {
    describe('has free trial', () => {
      beforeEach(() => {
        component.subscription = FREE_TRIAL_AVAILABLE_SUBSCRIPTION;
        component.selectedTier = FREE_TRIAL_AVAILABLE_SUBSCRIPTION.tiers[0];
        fixture.detectChanges();
      });
      it('should show description with trial', () => {
        const tierTitle = fixture.debugElement.queryAll(By.css('.Card'))[0].query(By.css('.Card__subtitle')).nativeElement;

        expect(tierTitle.textContent).toContain(component.subscription.tiers[0].price);
        expect(tierTitle.textContent).toContain(component.subscription.tiers[0].currency);
        expect(tierTitle.textContent).toContain($localize`:@@after_free_trial:after free trial`);
      });
    });

    describe('has not free trial', () => {
      it('should show description', () => {
        const tierTitle = fixture.debugElement.queryAll(By.css('.Card'))[0].query(By.css('.Card__subtitle')).nativeElement;

        expect(tierTitle.textContent).toContain(component.subscription.tiers[0].price);
        expect(tierTitle.textContent).toContain(component.subscription.tiers[0].currency);
        expect(tierTitle.textContent).not.toContain($localize`:@@after_free_trial:after free trial`);
      });
    });
  });
});
