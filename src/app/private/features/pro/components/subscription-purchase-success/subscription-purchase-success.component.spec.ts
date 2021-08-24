import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { ButtonComponent } from '@shared/button/button.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { UserAvatarComponent } from '@shared/user-avatar/user-avatar.component';
import { SubscriptionPurchaseSuccessComponent } from './subscription-purchase-success.component';

@Component({
  selector: 'tsl-svg-icon',
  template: '',
})
class MockSvgIcon {}

describe('SubscriptionPurchaseSuccessComponent', () => {
  let component: SubscriptionPurchaseSuccessComponent;
  let fixture: ComponentFixture<SubscriptionPurchaseSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionPurchaseSuccessComponent, ButtonComponent, UserAvatarComponent, MockSvgIcon],
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

  describe('Edit mode', () => {
    beforeEach(() => {
      component.isEditSubscription = true;
      fixture.detectChanges();
    });
    describe('Click CTA button', () => {
      it('should redirect to catalog', () => {
        spyOn(component.redirectTo, 'emit');
        const button: HTMLElement = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;

        button.click();

        expect(component.redirectTo.emit).toHaveBeenCalledTimes(1);
        expect(component.redirectTo.emit).toHaveBeenCalledWith(PRIVATE_PATHS.CATALOG);
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
  });

  describe('Avatar', () => {
    describe('and has avatar', () => {
      beforeEach(() => {
        component.user = MOCK_USER;
        fixture.detectChanges();
      });
      it('should show avatar', () => {
        const avatar = fixture.debugElement.query(By.directive(UserAvatarComponent));

        expect(avatar).toBeTruthy();
      });
    });

    describe('and has no avatar', () => {
      beforeEach(() => {
        component.user = MOCK_USER;
        component.user.image = null;
        fixture.detectChanges();
      });
      it('should not show avatar', () => {
        const avatar = fixture.debugElement.query(By.directive(UserAvatarComponent));

        expect(avatar).toBeFalsy();
      });

      it('should show pro badge', () => {
        const proBadge = fixture.debugElement.query(By.directive(MockSvgIcon));

        expect(proBadge).toBeTruthy();
        expect(proBadge.nativeElement.getAttribute('src')).toEqual('/assets/icons/badge-pro-dark.svg');
      });
    });
  });
});
