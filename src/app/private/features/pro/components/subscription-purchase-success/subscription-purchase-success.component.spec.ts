import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { ButtonComponent } from '@shared/button/button.component';

import { SubscriptionPurchaseSuccessComponent } from './subscription-purchase-success.component';

describe('SubscriptionPurchaseSuccessComponent', () => {
  let component: SubscriptionPurchaseSuccessComponent;
  let fixture: ComponentFixture<SubscriptionPurchaseSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionPurchaseSuccessComponent, ButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPurchaseSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Click CTA button', () => {
    it('should redirect to profile', () => {
      spyOn(component.redirectTo, 'emit');
      const button: HTMLElement = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;

      button.click();

      expect(component.redirectTo.emit).toHaveBeenCalledTimes(1);
      expect(component.redirectTo.emit).toHaveBeenCalledWith(PRIVATE_PATHS.PROFILE);
    });
  });

  describe('Click Secondary button', () => {
    it('should not redirect', () => {
      spyOn(component.redirectTo, 'emit');
      const button: HTMLElement = fixture.debugElement.query(By.css('.btn-secondary')).nativeElement;

      button.click();

      expect(component.redirectTo.emit).toHaveBeenCalledTimes(1);
      expect(component.redirectTo.emit).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Invoice text', () => {
    describe('and has invoice selected', () => {
      beforeEach(() => {
        component.invoicedRequired = true;
        fixture.detectChanges();
      });
      it('should show text', () => {
        const invoiceText: HTMLElement = fixture.debugElement.query(By.css('.SubscriptionPurchaseSuccess__subtitle')).nativeElement;

        expect(invoiceText).toBeTruthy();
      });
    });
    describe('and has not invoice selected', () => {
      beforeEach(() => {
        component.invoicedRequired = false;
        fixture.detectChanges();
      });
      it('should show text', () => {
        const invoiceText = fixture.debugElement.query(By.css('.SubscriptionPurchaseSuccess__subtitle'));

        expect(invoiceText).toBeFalsy;
      });
    });
  });
});
