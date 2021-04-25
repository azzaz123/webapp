import { DatePipe } from '@angular/common';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MAPPED_SUBSCRIPTIONS, MAPPED_SUBSCRIPTIONS_ADDED } from '@fixtures/subscriptions.fixtures.spec';
import { ButtonComponent } from '@shared/button/button.component';

import { SubscriptionCardComponent } from './subscription-card.component';

describe('SubscriptionCardComponent', () => {
  let component: SubscriptionCardComponent;
  let fixture: ComponentFixture<SubscriptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionCardComponent, ButtonComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionCardComponent);
    component = fixture.componentInstance;
  });

  describe('when has an active subscription ', () => {
    beforeEach(() => {
      component.subscription = MAPPED_SUBSCRIPTIONS[2];
      fixture.detectChanges();
    });

    it('should be shown as suscribed card design', () => {
      const card: DebugElement = fixture.debugElement.query(By.css('.SubscriptionCard--subscribed'));

      expect(card).toBeTruthy();
    });

    it('should not show trial banner', () => {
      const trialBanner: DebugElement = fixture.debugElement.query(By.css('.SubscriptionCard__trialBanner--hidden'));

      expect(trialBanner).toBeTruthy();
    });

    it('should show active icon', () => {
      expect(component.iconSrc).toEqual(`/assets/icons/categories/normal/${component.subscription.category_icon}.svg`);
    });

    it('should show title', () => {
      const title: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__title')).nativeElement;

      expect(title.textContent).toEqual(component.subscription.category_name);
    });

    it('should show subscription price', () => {
      const price: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard-info--price')).nativeElement;

      expect(price.textContent).toContain(component.subscription.selected_tier.price);
      expect(price.textContent).toContain(component.subscription.selected_tier.currency);
    });

    describe('and has tier limit', () => {
      it('should show tier limit', () => {
        const info: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__info')).nativeElement;

        expect(info.textContent).toContain(
          $localize`:@@web_profile_pages_subscription_325:${component.subscription.selected_tier.limit} products`
        );
      });
    });

    describe('and has not tier limit', () => {
      it('should not show tier limit', () => {
        component.subscription.selected_tier.limit = null;

        fixture.detectChanges();
        const info: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__info')).nativeElement;

        expect(info.textContent).toContain($localize`:@@web_profile_pages_subscription_586:No limit`);
      });
    });

    describe('and has text link', () => {
      beforeEach(() => {
        component.textLink = 'test';
        fixture.detectChanges();
      });

      it('should show text link', () => {
        const link: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__info--edit')).nativeElement;

        expect(link.textContent).toContain(component.textLink);
      });

      describe('and click on text link', () => {
        it('should emit click', () => {
          spyOn(component.clickLink, 'emit');

          const link: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__info--edit')).nativeElement;
          link.click();

          expect(component.clickLink.emit).toHaveBeenCalledTimes(1);
          expect(component.clickLink.emit).toHaveBeenLastCalledWith();
        });
      });
    });

    describe('and has subscription end', () => {
      beforeEach(() => {
        component.subscription.subscribed_until = 1567675697;
        fixture.detectChanges();
      });
      it('should show subscription end date', () => {
        const subscriptionEnd: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__until')).nativeElement;

        expect(subscriptionEnd.textContent).toContain(new DatePipe('en').transform(component.subscription.subscribed_until, 'dd/MM/yy'));
      });
    });

    describe('and has not subscription end', () => {
      beforeEach(() => {
        component.subscription.subscribed_until = null;
        fixture.detectChanges();
      });
      it('should show subscription start date', () => {
        const subscriptionStart: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__from')).nativeElement;

        expect(subscriptionStart.textContent).toContain(new DatePipe('en').transform(component.subscription.subscribed_from, 'dd/MM/yy'));
      });
    });
  });

  describe('when has not an active subscription ', () => {
    beforeEach(() => {
      component.subscription = MAPPED_SUBSCRIPTIONS[0];
      fixture.detectChanges();
    });

    it('should not be shown as suscribed card design', () => {
      const card: DebugElement = fixture.debugElement.query(By.css('.SubscriptionCard--subscribed'));

      expect(card).toBeFalsy();
    });

    describe('and has trial available', () => {
      beforeEach(() => {
        component.hasTrialAvailable = true;
        fixture.detectChanges();
      });
      it('should show trial banner', () => {
        const trialBannerHidden: DebugElement = fixture.debugElement.query(By.css('.SubscriptionCard__trialBanner--hidden'));

        expect(trialBannerHidden).toBeFalsy();
      });
      it('should show free days amount', () => {
        const trialBanner: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__trialBanner')).nativeElement;
        expect(trialBanner.textContent).toContain(component.subscription.trial_days);
      });
      it('should show free trial CTA', () => {
        const ctaButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        expect(ctaButton.textContent).toContain($localize`:@@startFreeTrial:Start free trial`);
      });
      describe('and click on CTA button', () => {
        it('should emit click', () => {
          spyOn(component.clickButton, 'emit');

          const ctaButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
          ctaButton.click();

          expect(component.clickButton.emit).toHaveBeenCalledTimes(1);
          expect(component.clickButton.emit).toHaveBeenLastCalledWith();
        });
      });
    });

    describe('and has not trial available', () => {
      beforeEach(() => {
        component.hasTrialAvailable = false;
        fixture.detectChanges();
      });
      it('should show trial banner', () => {
        const trialBannerHidden: DebugElement = fixture.debugElement.query(By.css('.SubscriptionCard__trialBanner--hidden'));

        expect(trialBannerHidden).toBeTruthy();
      });
      it('should show free trial CTA', () => {
        const ctaButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        expect(ctaButton.textContent).toContain($localize`:@@seePlans:See plans`);
      });
      describe('and click on CTA button', () => {
        it('should emit click', () => {
          spyOn(component.clickButton, 'emit');

          const ctaButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
          ctaButton.click();

          expect(component.clickButton.emit).toHaveBeenCalledTimes(1);
          expect(component.clickButton.emit).toHaveBeenLastCalledWith();
        });
      });
    });

    it('should show inactive icon', () => {
      expect(component.iconSrc).toEqual(`/assets/icons/categories/disabled/${component.subscription.category_icon}.svg`);
    });

    it('should show title', () => {
      const title: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__title')).nativeElement;

      expect(title.textContent).toEqual(component.subscription.category_name);
    });

    describe('and has limit', () => {
      it('should show current limit', () => {
        const info: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__info')).nativeElement;

        expect(info.textContent).toContain(
          $localize`:@@web_profile_pages_subscription_323:Limit without subscription: ${component.subscription.current_limit}`
        );
      });
    });

    describe('and has not limit', () => {
      it('should not show limit', () => {
        component.subscription.current_limit = null;

        fixture.detectChanges();
        const info: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionCard__info')).nativeElement;

        expect(info.textContent).toContain($localize`:@@web_profile_pages_subscription_586:No limit`);
      });
    });

    describe('and has text link', () => {
      beforeEach(() => {
        component.textLink = 'test';
        fixture.detectChanges();
      });

      it('should not show text link', () => {
        const link: DebugElement = fixture.debugElement.query(By.css('.SubscriptionCard__info--edit'));

        expect(link).toBeFalsy();
      });
    });
  });
});
