import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { TryProSlotComponent } from './try-pro-slot.component';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '@shared/button/button.component';
import { TIER_WITH_DISCOUNT } from '@fixtures/subscriptions.fixtures.spec';

describe('TryProSlotItemComponent', () => {
  let component: TryProSlotComponent;
  let fixture: ComponentFixture<TryProSlotComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TryProSlotComponent, ButtonComponent],
        providers: [{ provide: AnalyticsService, useClass: MockAnalyticsService }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TryProSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('CTA text', () => {
    it('should show trial text', () => {
      component.hasTrialAvailable = true;

      fixture.detectChanges();

      const submitButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
      expect(submitButton.textContent).toEqual('Free trial');
    });

    it('should show discount text', () => {
      component.hasTrialAvailable = false;
      component.tierWithDiscount = TIER_WITH_DISCOUNT;

      fixture.detectChanges();

      const submitButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
      expect(submitButton.textContent).toEqual(
        $localize`:@@listing_limit_non_pro_users_discount_modal_start_button:Try with ${component.tierWithDiscount.discount.percentage}:INTERPOLATION:% discount`
      );
    });

    it('should show default text', () => {
      fixture.detectChanges();

      const submitButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
      expect(submitButton.textContent).toEqual('Know more');
    });

    describe('when click CTA button', () => {
      it('should emit clickCTA event', () => {
        spyOn(component.clickCTA, 'emit');
        const submitButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;

        submitButton.click();

        expect(component.clickCTA.emit).toBeCalledTimes(1);
      });
    });

    describe('when click close', () => {
      it('should emit close event', () => {
        spyOn(component.close, 'emit');

        component.onClose();

        expect(component.close.emit).toBeCalledTimes(1);
      });
    });
  });
});
