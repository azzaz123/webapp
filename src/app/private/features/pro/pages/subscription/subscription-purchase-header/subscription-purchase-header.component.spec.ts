import { ChangeDetectionStrategy, Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FREE_TRIAL_AVAILABLE_SUBSCRIPTION, MAPPED_SUBSCRIPTIONS } from '@fixtures/subscriptions.fixtures.spec';
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
      declarations: [SubscriptionPurchaseHeaderComponent, MockSvgIconComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(SubscriptionPurchaseHeaderComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPurchaseHeaderComponent);
    component = fixture.componentInstance;
    component.subscription = MAPPED_SUBSCRIPTIONS[0];
    component.benefits = ['benefit1', 'benefit2'];

    fixture.detectChanges();
  });

  describe('has subscription', () => {
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
      const trialBanner: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionPurchaseHeader__trialBanner')).nativeElement;

      expect(trialBanner.textContent).toContain(component.subscription.trial_days);
    });
  });

  describe('has no free trial', () => {
    it('should not show free trial label', () => {
      const trialBanner = fixture.debugElement.query(By.css('.SubscriptionPurchaseHeader__trialBanner'));

      expect(trialBanner).toBeFalsy();
    });
  });

  describe('has benefits', () => {
    it('should show benefits', () => {
      const benefits = fixture.debugElement.query(By.css('.SubscriptionPurchaseHeader__benefits')).children[0];

      expect(benefits.children.length).toEqual(component.benefits.length);
      benefits.children.forEach((benefit, index) => {
        expect(benefit.nativeElement.textContent).toContain(component.benefits[index]);
      });
    });
  });
});
