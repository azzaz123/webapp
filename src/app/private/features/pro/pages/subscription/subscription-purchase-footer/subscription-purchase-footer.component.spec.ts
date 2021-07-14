import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FREE_TRIAL_AVAILABLE_SUBSCRIPTION, MAPPED_SUBSCRIPTIONS } from '@fixtures/subscriptions.fixtures.spec';
import { ButtonComponent } from '@shared/button/button.component';

import { SubscriptionPurchaseFooterComponent } from './subscription-purchase-footer.component';

describe('SubscriptionPurchaseFooterComponent', () => {
  let component: SubscriptionPurchaseFooterComponent;
  let fixture: ComponentFixture<SubscriptionPurchaseFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionPurchaseFooterComponent, ButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPurchaseFooterComponent);
    component = fixture.componentInstance;
    component.subscription = MAPPED_SUBSCRIPTIONS[0];
    component.selectedTier = MAPPED_SUBSCRIPTIONS[0].tiers[0];
    fixture.detectChanges();
  });

  describe('Button text', () => {
    describe('Has trial available', () => {
      beforeEach(() => {
        component.subscription = FREE_TRIAL_AVAILABLE_SUBSCRIPTION;
        component.selectedTier = FREE_TRIAL_AVAILABLE_SUBSCRIPTION.tiers[0];
        component.ngOnInit();
        fixture.detectChanges();
      });
      it('should show trial text', () => {
        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;

        expect(button.textContent).toContain($localize`:@@web_start_free_trial:Start free trial`);
      });
    });
    describe('Has no trial available', () => {
      it('should show pay text', () => {
        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;

        expect(button.textContent).toContain($localize`:@@web_pay:Pay`);
      });
    });
  });

  describe('Button click', () => {
    beforeEach(() => {
      spyOn(component.buttonPurchaseClick, 'emit');
    });
    describe('and button is enabled', () => {
      it('should emit click', () => {
        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(component.buttonPurchaseClick.emit).toHaveBeenCalledTimes(1);
      });
    });
    describe('and button is disabled', () => {
      beforeEach(() => {
        component.buttonDisable = true;
        fixture.detectChanges();
      });
      it('should not emit click', () => {
        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(component.buttonPurchaseClick.emit).not.toHaveBeenCalled();
      });
    });
    describe('and button is loading', () => {
      beforeEach(() => {
        component.isLoading = true;
        fixture.detectChanges();
      });
      it('should not emit click', () => {
        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(component.buttonPurchaseClick.emit).not.toHaveBeenCalled();
      });
    });
  });
  describe('Description text', () => {
    describe('Has trial available', () => {
      beforeEach(() => {
        component.subscription = FREE_TRIAL_AVAILABLE_SUBSCRIPTION;
        component.selectedTier = FREE_TRIAL_AVAILABLE_SUBSCRIPTION.tiers[0];
        fixture.detectChanges();
      });
      it('should show trial text', () => {
        const description: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionPurchaseFooter__description')).nativeElement;

        expect(description.textContent).toContain(component.selectedTier.price);
        expect(description.textContent).toContain(component.selectedTier.currency);
        expect(description.textContent).toContain($localize`:@@web_price_after_free_days:at the end of free trial`);
      });

      it('should show empty price', () => {
        component.ngOnChanges({ selectedTier: new SimpleChange(null, component.selectedTier, false) });
        fixture.detectChanges();

        const price: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionPurchaseFooter__amount')).nativeElement;
        expect(price.textContent).toContain('0,00');
        expect(price.textContent).toContain(component.selectedTier.currency);
      });
    });
    describe('Has not trial available', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });
      it('should not show trial text', () => {
        const description: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionPurchaseFooter__description')).nativeElement;

        expect(description.textContent).toContain($localize`:@@web_monthly_renewal_plan:The plan will be renewed monthly`);
      });

      it('should show price', () => {
        component.ngOnChanges({ selectedTier: new SimpleChange(null, component.selectedTier, false) });
        fixture.detectChanges();

        const price: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionPurchaseFooter__amount')).nativeElement;
        expect(price.textContent).toContain(component.selectedTier.price);
        expect(price.textContent).toContain(component.selectedTier.currency);
      });
    });
  });
});
