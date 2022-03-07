import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { PayviewDeliveryPointsComponent } from '@private/features/payview/modules/delivery/components/points/payview-delivery-points.component';
import { PayviewPromotionOverviewComponent } from '@private/features/payview/modules/promotion/components/overview/payview-promotion-overview.component';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

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

      component.costs = MOCK_PAYVIEW_STATE.costs;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('WHEN costs have been reported', () => {
      it('should show the promotion block', () => {
        const target = debugElement.query(By.css(payviewPromotionSelector));

        expect(target).toBeTruthy();
      });
    });

    describe('WHEN costs have not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewPromotionOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.costs = null;

        fixture.detectChanges();
      });

      it('should not show the promotion block', () => {
        const target = debugElement.query(By.css(payviewPromotionSelector));

        component.costs = null;
        fixture.detectChanges();

        expect(target).toBeFalsy();
      });
    });
  });
});
