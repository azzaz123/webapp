import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED,
  MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED,
  MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED,
  TIER_WITH_DISCOUNT,
} from '@fixtures/subscriptions.fixtures.spec';
import { ButtonComponent } from '@shared/button/button.component';
import { SubscriptionCardComponent } from './subscription-card.component';

describe('SubscriptionCardComponent', () => {
  let component: SubscriptionCardComponent;
  let fixture: ComponentFixture<SubscriptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionCardComponent, ButtonComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(SubscriptionCardComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionCardComponent);
    component = fixture.componentInstance;
  });

  describe('when has an active subscription ', () => {
    beforeEach(() => {
      component.subscription = MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED;
      component.isSubscribed = true;
      fixture.detectChanges();
    });

    it('should be shown as suscribed card design', () => {
      const card = fixture.debugElement.query(By.css('.SubscriptionCard--subscribed'));

      expect(card).toBeTruthy();
    });

    it('should not show trial banner', () => {
      const trialBanner = fixture.debugElement.query(By.css('.SubscriptionCard__banner--hidden'));

      expect(trialBanner).toBeTruthy();
    });

    it('should show active icon', () => {
      expect(component.iconSrc).toEqual(`/assets/icons/categories/disabled/${component.subscription.category_icon}.svg`);
    });

    it('should show title', () => {
      const title: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__title')).nativeElement;

      expect(title.textContent).toEqual(component.subscription.category_name);
    });

    it('should show subscription price', () => {
      const price: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__price')).nativeElement;

      expect(price.textContent).toContain(component.subscription.selected_tier.price);
      expect(price.textContent).toContain(component.subscription.selected_tier.currency);
    });

    it('should show subscription from date', () => {
      const subscriptionEnd: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__date')).nativeElement;

      expect(subscriptionEnd.textContent).toContain(new DatePipe('en').transform(component.subscription.subscribed_from, 'longDate'));
    });

    describe('and has tier limit', () => {
      describe('and is real estate', () => {
        beforeEach(() => {
          component.subscription = MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED;
          component.isSubscribed = true;
          fixture.detectChanges();
        });
        it('should show tier limit', () => {
          const info: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__info')).nativeElement;

          expect(info.textContent).toContain(
            $localize`:@@web_profile_pages_subscription_332:List up to ${component.subscription.selected_tier.limit} real estate`
          );
        });
      });
      describe('and is not Real estate', () => {
        it('should show tier limit', () => {
          const info: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__info')).nativeElement;

          expect(info.textContent).toContain(
            $localize`:@@web_profile_pages_subscription_325:List up to ${component.subscription.selected_tier.limit} items`
          );
        });
      });
    });

    describe('and has not tier limit', () => {
      it('should not show tier limit', () => {
        component.subscription.selected_tier.limit = null;

        fixture.detectChanges();
        const info: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__info')).nativeElement;

        expect(info.textContent).toContain($localize`:@@web_profile_pages_subscription_586:List without limits`);
      });
    });

    describe('end date', () => {
      describe('and has subscription end', () => {
        beforeEach(() => {
          component.subscription.subscribed_until = component.subscription.subscribed_from + 1000 * 60 * 60 * 24;
          fixture.detectChanges();
        });
        it('should show subscription end date', () => {
          const subscriptionEnd: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__info')).nativeElement;

          expect(subscriptionEnd.textContent).toContain(new DatePipe('en').transform(component.subscription.subscribed_until, 'longDate'));
        });
      });

      describe('and has not subscription end', () => {
        beforeEach(() => {
          component.subscription.subscribed_until = null;
          fixture.detectChanges();
        });
        it('should show subscription start date', () => {
          const subscriptionStart: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__info')).nativeElement;

          expect(subscriptionStart.textContent).not.toContain(
            new DatePipe('en').transform(component.subscription.subscribed_until, 'longDate')
          );
        });
      });
    });
  });

  describe('when has not an active subscription ', () => {
    beforeEach(() => {
      component.subscription = MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED;
      fixture.detectChanges();
    });

    it('should not be shown as suscribed card design', () => {
      const card = fixture.debugElement.query(By.css('.SubscriptionCard--subscribed'));

      expect(card).toBeFalsy();
    });

    describe('and has trial available', () => {
      beforeEach(() => {
        component.hasTrialAvailable = true;
        fixture.detectChanges();
      });
      it('should show banner', () => {
        const trialBannerHidden = fixture.debugElement.query(By.css('.SubscriptionCard__banner--hidden'));

        expect(trialBannerHidden).toBeFalsy();
      });
      it('should show free days amount', () => {
        const trialBanner: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__banner')).nativeElement;

        expect(trialBanner.textContent).toContain(component.subscription.trial_days);
      });
      it('should show trial banner', () => {
        const trialBannerHidden = fixture.debugElement.query(By.css('.SubscriptionCard__banner--trial'));

        expect(trialBannerHidden).toBeTruthy();
      });
    });

    describe('and has discount available', () => {
      beforeEach(() => {
        component.hasTrialAvailable = false;
        component.tierDiscount = TIER_WITH_DISCOUNT;
        fixture.detectChanges();
      });
      it('should show banner', () => {
        const trialBannerHidden = fixture.debugElement.query(By.css('.SubscriptionCard__banner--hidden'));

        expect(trialBannerHidden).toBeFalsy();
      });
      it('should show discount percentage', () => {
        const trialBanner: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__banner')).nativeElement;

        expect(trialBanner.textContent).toContain(TIER_WITH_DISCOUNT.discount.percentage);
      });
      it('should show discount banner', () => {
        const trialBannerHidden = fixture.debugElement.query(By.css('.SubscriptionCard__banner--discount'));

        expect(trialBannerHidden).toBeTruthy();
      });
    });

    describe('and has not trial or discount available', () => {
      beforeEach(() => {
        component.hasTrialAvailable = false;
        component.tierDiscount = null;
        fixture.detectChanges();
      });
      it('should not show banner', () => {
        const trialBannerHidden = fixture.debugElement.query(By.css('.SubscriptionCard__banner--hidden'));

        expect(trialBannerHidden).toBeTruthy();
      });
    });

    it('should show inactive icon', () => {
      expect(component.iconSrc).toEqual(`/assets/icons/categories/normal/${component.subscription.category_icon}.svg`);
    });

    it('should show title', () => {
      const title: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__title')).nativeElement;

      expect(title.textContent).toEqual(component.subscription.category_name);
    });

    it('should show benefits', () => {
      component.subscriptionBenefits = ['benefit1', 'benefit2'];
      fixture.detectChanges();

      const benefitsContainer: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__info')).nativeElement;
      expect(benefitsContainer.children[0].children.length).toBe(2);
    });
  });

  describe('CTA button', () => {
    beforeEach(() => {
      component.subscription = MOCK_SUBSCRIPTION_CARS_NOT_SUBSCRIBED_MAPPED;
      component.textButton = 'test';
      fixture.detectChanges();
    });
    it('should show text', () => {
      const ctaButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
      expect(ctaButton.textContent).toContain(component.textButton);
    });
    describe('and click on CTA button', () => {
      it('should emit click', () => {
        spyOn(component.buttonClick, 'emit');

        const ctaButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        ctaButton.click();

        expect(component.buttonClick.emit).toHaveBeenCalledTimes(1);
        expect(component.buttonClick.emit).toHaveBeenLastCalledWith();
      });
    });
  });
});
