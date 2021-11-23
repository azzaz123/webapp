import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  FREE_TRIAL_AVAILABLE_SUBSCRIPTION,
  MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED,
  SUBSCRIPTIONS,
} from '@fixtures/subscriptions.fixtures.spec';
import { DiscountBadgeComponent } from '@private/features/pro/components/discount-badge/discount-badge.component';
import { SubscriptionPurchaseHeaderComponent } from './subscription-purchase-header.component';

@Component({
  selector: 'tsl-svg-icon',
  template: '',
})
class MockSvgIconComponent {
  @Input() src: string;
}

describe('SubscriptionPurchaseHeaderComponent', () => {
  let component: SubscriptionPurchaseHeaderComponent;
  let fixture: ComponentFixture<SubscriptionPurchaseHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionPurchaseHeaderComponent, MockSvgIconComponent, DiscountBadgeComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPurchaseHeaderComponent);
    component = fixture.componentInstance;
    component.subscription = SUBSCRIPTIONS[0];
    component.benefits = ['benefit1', 'benefit2'];
  });

  describe('has subscription', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    it('should show subscription name', () => {
      const titleElement: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionPurchaseHeader__title')).nativeElement;

      expect(titleElement.textContent).toContain(component.subscription.category_name);
    });

    it('should show image', () => {
      const element = fixture.debugElement.query(By.css('.SubscriptionPurchaseHeader__icon')).query(By.directive(MockSvgIconComponent));
      expect(element).toBeTruthy();

      const child: MockSvgIconComponent = element.componentInstance;
      expect(child.src).toBe(component.iconSrc);
    });
  });

  describe('has free trial', () => {
    beforeEach(() => {
      component.subscription = FREE_TRIAL_AVAILABLE_SUBSCRIPTION;
      fixture.detectChanges();
    });

    it('should show free trial label', () => {
      const trialBanner: HTMLElement = fixture.debugElement.query(By.directive(DiscountBadgeComponent)).nativeElement;

      expect(trialBanner.textContent).toContain(component.subscription.trial_days);
    });
  });

  describe('has no free trial', () => {
    it('should not show free trial label', () => {
      const trialBanner = fixture.debugElement.query(By.directive(DiscountBadgeComponent));

      expect(trialBanner).toBeFalsy();
    });
  });

  describe('has benefits', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    it('should show benefits', () => {
      const benefits = fixture.debugElement.query(By.css('.SubscriptionPurchaseHeader__benefits')).children[0];

      expect(benefits.children.length).toEqual(component.benefits.length);
      benefits.children.forEach((benefit, index) => {
        expect(benefit.nativeElement.textContent).toContain(component.benefits[index]);
      });
    });
  });

  describe('Categories link', () => {
    describe('and has more than one category', () => {
      beforeEach(() => {
        component.subscription = MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED;
        fixture.detectChanges();
      });
      it('should show link', () => {
        spyOn(component.clickLink, 'emit').and.callThrough();
        const link = fixture.debugElement.query(By.css('.SubscriptionPurchaseHeader__link'));

        expect(link).toBeTruthy();
      });
      it('should emit click', () => {
        spyOn(component.clickLink, 'emit').and.callThrough();
        const link: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionPurchaseHeader__link')).nativeElement;

        link.click();

        expect(component.clickLink.emit).toBeCalledTimes(1);
        expect(component.clickLink.emit).toBeCalledWith();
      });
    });
    describe('and has more than one category', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });
      it('should not show link', () => {
        spyOn(component.clickLink, 'emit').and.callThrough();
        const link = fixture.debugElement.query(By.css('.SubscriptionPurchaseHeader__link'));

        expect(link).toBeFalsy();
      });
    });
  });
});
