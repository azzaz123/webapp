import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { PayviewPromotionOverviewComponent } from '@private/features/payview/modules/promotion/components/overview/payview-promotion-overview.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';

describe('PayviewPromotionOverviewComponent', () => {
  const payviewPromotionSelector: string = '.PayviewPromotion';

  let component: PayviewPromotionOverviewComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewPromotionOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent, PayviewPromotionOverviewComponent, SvgIconComponent],
      imports: [BrowserAnimationsModule, HttpClientTestingModule],
      providers: [],
    }).compileComponents();
  });

  describe('WHEN initializes', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewPromotionOverviewComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      component.payviewState = MOCK_PAYVIEW_STATE;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('WHEN payview state has been reported', () => {
      it('should show the payview block', () => {
        const target = debugElement.query(By.css(payviewPromotionSelector));

        expect(target).toBeTruthy();
      });

      describe('WHEN delivery points have been reported', () => {
        it('should show the payview block', () => {
          const target = debugElement.query(By.directive(PayviewDeliveryPointsComponent));

          expect(target).toBeTruthy();
        });

        it('should assign the corresponding default delivery method', () => {
          const target = debugElement.query(By.directive(PayviewDeliveryPointsComponent));

          expect(target.componentInstance.defaultDeliveryMethod).toEqual(MOCK_DELIVERY_BUYER_DELIVERY_METHODS.default.index);
        });

        it('should assign the corresponding delivery costs', () => {
          const target = debugElement.query(By.directive(PayviewDeliveryPointsComponent));

          expect(target.componentInstance.deliveryCosts).toEqual(MOCK_PAYVIEW_STATE.delivery.costs);
        });

        it('should assign the corresponding delivery method', () => {
          const target = debugElement.query(By.directive(PayviewDeliveryPointsComponent));

          expect(target.componentInstance.deliveryMethods).toEqual(MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods);
        });
      });
    });

    describe('WHEN payview state has not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewPromotionOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.payviewState = null;

        fixture.detectChanges();
      });

      it('should not show the payview block', () => {
        const target = debugElement.query(By.css(payviewPromotionSelector));

        component.payviewState = null;
        fixture.detectChanges();

        expect(target).toBeFalsy();
      });
    });

    describe('WHEN delivery has not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewPromotionOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        const payviewState: PayviewState = { ...MOCK_PAYVIEW_STATE };
        payviewState.delivery = null;
        component.payviewState = payviewState;

        fixture.detectChanges();
      });

      it('should not show the payview block', () => {
        const target = debugElement.query(By.css(payviewPromotionSelector));

        component.payviewState = null;
        fixture.detectChanges();

        expect(target).toBeFalsy();
      });
    });
  });
});
