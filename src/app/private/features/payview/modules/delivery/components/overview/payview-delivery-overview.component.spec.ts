import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DeliveryRadioSelectorModule } from '@private/shared/delivery-radio-selector/delivery-radio-selector.module';
import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { PayviewDeliveryHeaderComponent } from '@private/features/payview/modules/delivery/components/header/payview-delivery-header.component';
import { PayviewDeliveryOverviewComponent } from '@private/features/payview/modules/delivery/components/overview/payview-delivery-overview.component';
import { PayviewDeliveryPointsComponent } from '@private/features/payview/modules/delivery/components/points/payview-delivery-points.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';

describe('PayviewDeliveryOverviewComponent', () => {
  const payviewDeliverySelector: string = '.PayviewDelivery';

  let component: PayviewDeliveryOverviewComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewDeliveryOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewDeliveryHeaderComponent, PayviewDeliveryOverviewComponent, PayviewDeliveryPointsComponent, SvgIconComponent],
      imports: [DeliveryRadioSelectorModule, HttpClientTestingModule],
      providers: [],
    }).compileComponents();
  });

  describe('WHEN initializes', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewDeliveryOverviewComponent);
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
        const target = debugElement.query(By.css(payviewDeliverySelector));

        expect(target).toBeTruthy();
      });

      describe('WHEN delivery points have been reported', () => {
        it('should show the payview block', () => {
          const target = debugElement.query(By.directive(PayviewDeliveryPointsComponent));

          expect(target).toBeTruthy();
        });

        it('should assign the corresponding delivery costs', () => {
          const target = debugElement.query(By.directive(PayviewDeliveryPointsComponent));

          expect(target.componentInstance.deliveryCosts).toEqual(MOCK_PAYVIEW_STATE.delivery.costs);
        });

        it('should assign the corresponding delivery method', () => {
          const target = debugElement.query(By.directive(PayviewDeliveryPointsComponent));

          expect(target.componentInstance.deliveryMethods).toEqual(MOCK_PAYVIEW_STATE.delivery.methods.deliveryMethods);
        });
      });
    });

    describe('WHEN payview state has not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewDeliveryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.payviewState = null;

        fixture.detectChanges();
      });

      it('should not show the payview block', () => {
        const target = debugElement.query(By.css(payviewDeliverySelector));

        component.payviewState = null;
        fixture.detectChanges();

        expect(target).toBeFalsy();
      });
    });

    describe('WHEN delivery has not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewDeliveryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        const payviewState: PayviewState = { ...MOCK_PAYVIEW_STATE };
        payviewState.delivery = null;
        component.payviewState = payviewState;

        fixture.detectChanges();
      });

      it('should not show the payview block', () => {
        const target = debugElement.query(By.css(payviewDeliverySelector));

        component.payviewState = null;
        fixture.detectChanges();

        expect(target).toBeFalsy();
      });
    });
  });
});
