import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { DeliveryRadioSelectorModule } from '@private/shared/delivery-radio-selector/delivery-radio-selector.module';
import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { PayviewDeliveryHeaderComponent } from '@private/features/payview/modules/delivery/components/header/payview-delivery-header.component';
import { PayviewDeliveryOverviewComponent } from '@private/features/payview/modules/delivery/components/overview/payview-delivery-overview.component';
import { PayviewDeliveryPointComponent } from '@private/features/payview/modules/delivery/components/point/payview-delivery-point.component';
import { PayviewDeliveryPointsComponent } from '@private/features/payview/modules/delivery/components/points/payview-delivery-points.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';

@Component({
  selector: 'tsl-delivery-address',
  template: '',
})
class FakeDeliveryAddressComponent {
  @Input() showTitle;
  @Input() whereUserComes;
}

describe('PayviewDeliveryOverviewComponent', () => {
  const payviewDeliverySelector: string = '.PayviewDelivery';

  let component: PayviewDeliveryOverviewComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewDeliveryOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ButtonComponent,
        FakeDeliveryAddressComponent,
        PayviewDeliveryHeaderComponent,
        PayviewDeliveryOverviewComponent,
        PayviewDeliveryPointComponent,
        PayviewDeliveryPointsComponent,
        SvgIconComponent,
      ],
      imports: [BrowserAnimationsModule, DeliveryRadioSelectorModule, HttpClientTestingModule],
      providers: [],
    }).compileComponents();
  });

  describe('WHEN initializes', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewDeliveryOverviewComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      const payviewState: PayviewState = { ...MOCK_PAYVIEW_STATE };
      component.costs = payviewState.delivery.costs;
      component.methods = payviewState.delivery.methods;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('WHEN payview state has been reported', () => {
      it('should show the payview block', () => {
        const target = debugElement.query(By.css(payviewDeliverySelector));

        expect(target).toBeTruthy();
      });

      describe('WHEN delivery points have been reported', () => {
        it('should show the payview block', () => {
          const target = debugElement.query(By.directive(PayviewDeliveryPointsComponent));

          expect(target).toBeTruthy();
        });

        it('should assign the corresponding default delivery method', () => {
          const target = debugElement.query(By.directive(PayviewDeliveryPointsComponent));

          expect(target.componentInstance.defaultMethod).toEqual(MOCK_DELIVERY_BUYER_DELIVERY_METHODS.default.index);
        });

        it('should assign the corresponding delivery costs', () => {
          const target = debugElement.query(By.directive(PayviewDeliveryPointsComponent));

          expect(target.componentInstance.costs).toEqual(MOCK_PAYVIEW_STATE.delivery.costs);
        });

        it('should assign the corresponding delivery method', () => {
          const target = debugElement.query(By.directive(PayviewDeliveryPointsComponent));

          expect(target.componentInstance.methods).toEqual(MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods);
        });
      });
    });

    describe('WHEN methods have not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewDeliveryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        const payviewState: PayviewState = { ...MOCK_PAYVIEW_STATE };
        component.costs = payviewState.delivery.costs;
        component.methods = null;

        fixture.detectChanges();
      });

      it('should not show the payview block', () => {
        const target = debugElement.query(By.css(payviewDeliverySelector));

        expect(target).toBeFalsy();
      });
    });

    describe('WHEN costs have not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewDeliveryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        const payviewState: PayviewState = { ...MOCK_PAYVIEW_STATE };
        component.costs = null;
        component.methods = payviewState.delivery.methods;

        fixture.detectChanges();
      });

      it('should not show the payview block', () => {
        const target = debugElement.query(By.css(payviewDeliverySelector));

        expect(target).toBeFalsy();
      });
    });
  });
});
