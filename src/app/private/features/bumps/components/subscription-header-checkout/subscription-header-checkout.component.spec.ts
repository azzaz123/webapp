import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_BUMPS_PACKAGE_BALANCE_MAPPED } from '@fixtures/bump-package.fixtures.spec';
import {
  MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED_SUBSCRIBED,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED,
  MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED,
} from '@fixtures/subscriptions.fixtures.spec';
import { SubscriptionHeaderCheckoutComponent } from './subscription-header-checkout.component';

describe('SubscriptionHeaderCheckoutComponent', () => {
  let component: SubscriptionHeaderCheckoutComponent;
  let fixture: ComponentFixture<SubscriptionHeaderCheckoutComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionHeaderCheckoutComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionHeaderCheckoutComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  describe('And has not an subscription', () => {
    beforeEach(() => {
      component.subscription = MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED;
      fixture.detectChanges();
    });
    it('should show no active subscription text', () => {
      const title: HTMLElement = debugElement.query(By.css('.SubscriptionHeaderCheckout__title')).nativeElement;

      expect(title.textContent).toEqual(
        $localize`:@@highlight_item_view_pro_user_item_card_no_subscription_plural_name_web_specific:Not included in your subscriptions`
      );
    });
  });

  describe('And has an subscription', () => {
    describe('describe subscription has not bumps', () => {
      beforeEach(() => {
        component.subscription = MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED;
        fixture.detectChanges();
      });
      it('Should show subscription into title', () => {
        const title: HTMLElement = debugElement.query(By.css('.SubscriptionHeaderCheckout__title')).nativeElement;

        expect(title.textContent).toContain(component.subscription.category_name);
      });
      it('Should not show counters', () => {
        const counters = debugElement.query(By.css('.SubscriptionHeaderCheckout__counter'));

        expect(counters).toBeFalsy();
      });
    });
    describe('describe subscription has a single bump type', () => {
      beforeEach(() => {
        component.subscription = MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED_SUBSCRIBED[0];
        component.balance = MOCK_BUMPS_PACKAGE_BALANCE_MAPPED[1].balance;
      });
      it('Should show subscription into title', () => {
        fixture.detectChanges();
        const title: HTMLElement = debugElement.query(By.css('.SubscriptionHeaderCheckout__title')).nativeElement;

        expect(title.textContent).toContain(component.subscription.category_name);
      });
      it('Should show counters', () => {
        fixture.detectChanges();
        const counters = debugElement.queryAll(By.css('.SubscriptionHeaderCheckout__counter'));

        expect(counters.length).toEqual(component.balance.length);
        component.balance.forEach((bump, index) => {
          const counter: HTMLElement = counters[index].nativeElement;
          expect(counter.textContent).toContain(bump.remaining);
        });
      });
    });

    describe('describe subscription has multiple bump types', () => {
      beforeEach(() => {
        component.subscription = MOCK_RESPONSE_SUBSCRIPTION_WITH_BUMPS_MAPPED_SUBSCRIBED[1];
        component.balance = MOCK_BUMPS_PACKAGE_BALANCE_MAPPED[0].balance;
        fixture.detectChanges();
      });
      it('Should show subscription into title', () => {
        const title: HTMLElement = debugElement.query(By.css('.SubscriptionHeaderCheckout__title')).nativeElement;

        expect(title.textContent).toContain(component.subscription.category_name);
      });
      it('Should show counters', () => {
        const counters = debugElement.queryAll(By.css('.SubscriptionHeaderCheckout__counter'));

        expect(counters.length).toEqual(component.balance.length);
        component.balance.forEach((bump, index) => {
          const counter: HTMLElement = counters[index].nativeElement;
          expect(counter.textContent).toContain(bump.remaining);
        });
      });
      it('and has a counter with limit reached', () => {
        const counters = debugElement.queryAll(By.css('.SubscriptionHeaderCheckout__counter'));

        component.balance.forEach((bump, index) => {
          if (bump.total + bump.extra === bump.used) {
            const counter: HTMLElement = counters[index].nativeElement;
            expect(counter.className).toContain('SubscriptionHeaderCheckout__counter--completed');
          }
        });
      });
      it('and has a counter without limit reached', () => {
        const counters = debugElement.queryAll(By.css('.SubscriptionHeaderCheckout__counter'));

        component.subscription.selected_tier.bumps.forEach((bump, index) => {
          if (bump.quantity !== bump.used) {
            const counter: HTMLElement = counters[index].nativeElement;
            expect(counter.className).not.toContain('SubscriptionHeaderCheckout__counter--completed');
          }
        });
      });
    });
  });
});
