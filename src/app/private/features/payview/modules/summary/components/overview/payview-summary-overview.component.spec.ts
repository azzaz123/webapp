import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { PayviewSummaryCostDetailComponent } from '@private/features/payview/modules/summary/components/cost-detail/payview-summary-cost-detail.component';
import { PayviewSummaryHeaderComponent } from '@private/features/payview/modules/summary/components/header/payview-summary-header.component';
import { PayviewSummaryOverviewComponent } from '@private/features/payview/modules/summary/components/overview/payview-summary-overview.component';
import { PayviewSummaryPaymentMethodComponent } from '@private/features/payview/modules/summary/components/payment-method/payview-summary-payment-method.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

describe('PayviewSummaryOverviewComponent', () => {
  let component: PayviewSummaryOverviewComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewSummaryOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PayviewSummaryCostDetailComponent,
        PayviewSummaryHeaderComponent,
        PayviewSummaryOverviewComponent,
        PayviewSummaryPaymentMethodComponent,
        SvgIconComponent,
      ],
      imports: [HttpClientTestingModule],
      providers: [],
    }).compileComponents();
  });

  describe('WHEN initializes', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewSummaryOverviewComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      component.payviewState = MOCK_PAYVIEW_STATE;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('WHEN the item and the delivery methods have been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewSummaryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.payviewState = MOCK_PAYVIEW_STATE;
      });

      it('should show the summary header', () => {
        fixture.detectChanges();

        const target = debugElement.query(By.directive(PayviewSummaryHeaderComponent));

        expect(target).toBeTruthy();
      });

      it('should assign the corresponding delivery method', () => {
        fixture.detectChanges();

        const target = debugElement.query(By.directive(PayviewSummaryHeaderComponent));

        expect(target.componentInstance.deliveryMethod).toEqual(MOCK_PAYVIEW_STATE.delivery.methods.current);
      });

      it('should assign the corresponding image', () => {
        fixture.detectChanges();

        const target = debugElement.query(By.directive(PayviewSummaryHeaderComponent));

        expect(target.componentInstance.image).toEqual(MOCK_PAYVIEW_STATE.item.mainImage);
      });

      it('should assign the corresponding title', () => {
        fixture.detectChanges();

        const target = debugElement.query(By.directive(PayviewSummaryHeaderComponent));

        expect(target.componentInstance.title).toEqual(MOCK_PAYVIEW_STATE.item.title);
      });

      describe('and NOT should show the purchase summary title', () => {
        it('should NOT show the title', () => {
          fixture.detectChanges();

          const target = debugElement.query(By.css('#purchaseSummaryTitle'));

          expect(target).toBeFalsy();
        });
      });

      describe('and should show the purchase summary title', () => {
        beforeEach(() => {
          component.showPurchaseSummaryTitle = true;
          fixture.detectChanges();
        });

        it('should show the title', () => {
          const target = debugElement.query(By.css('#purchaseSummaryTitle'));

          expect(target).toBeTruthy();
        });
      });
    });

    describe('WHEN the costs and the product name have been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewSummaryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.payviewState = MOCK_PAYVIEW_STATE;

        fixture.detectChanges();
      });

      it('should show the summary cost detail', () => {
        const target = debugElement.query(By.directive(PayviewSummaryCostDetailComponent));

        expect(target).toBeTruthy();
      });

      it('should assign the corresponding costs', () => {
        const target = debugElement.query(By.directive(PayviewSummaryCostDetailComponent));

        expect((target.componentInstance as PayviewSummaryCostDetailComponent).costs).toEqual(MOCK_PAYVIEW_STATE.costs);
      });

      it('should assign the corresponding product name', () => {
        const target = debugElement.query(By.directive(PayviewSummaryCostDetailComponent));

        expect((target.componentInstance as PayviewSummaryCostDetailComponent).productName).toEqual(MOCK_PAYVIEW_STATE.item.title);
      });
    });

    describe('WHEN the preferences have been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewSummaryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.payviewState = MOCK_PAYVIEW_STATE;

        fixture.detectChanges();
      });

      it('should show the summary payment method', () => {
        const target = debugElement.query(By.directive(PayviewSummaryPaymentMethodComponent));

        expect(target).toBeTruthy();
      });

      it('should assign the corresponding card', () => {
        const target = debugElement.query(By.directive(PayviewSummaryPaymentMethodComponent));

        expect(target.componentInstance.creditCard).toEqual(MOCK_PAYVIEW_STATE.payment.card);
      });

      it('should assign the corresponding payment method', () => {
        const target = debugElement.query(By.directive(PayviewSummaryPaymentMethodComponent));

        expect((target.componentInstance as PayviewSummaryPaymentMethodComponent).paymentMethod).toEqual(
          MOCK_PAYVIEW_STATE.payment.preferences.preferences
        );
      });
    });

    describe('WHEN the item has not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewSummaryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.payviewState = { ...MOCK_PAYVIEW_STATE };
        component.payviewState.item = null;
        component.payviewState.costs = null;

        fixture.detectChanges();
      });

      it('should not show the summary header', () => {
        const target = debugElement.query(By.directive(PayviewSummaryHeaderComponent));

        expect(target).toBeFalsy();
      });
    });

    describe('WHEN the delivery methods have not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewSummaryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.payviewState = { ...MOCK_PAYVIEW_STATE };
        component.payviewState.delivery.methods = null;
        component.payviewState.costs = null;

        fixture.detectChanges();
      });

      it('should not show the summary header', () => {
        const target = debugElement.query(By.directive(PayviewSummaryHeaderComponent));

        expect(target).toBeFalsy();
      });
    });

    describe('WHEN the costs have not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewSummaryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.payviewState = { ...MOCK_PAYVIEW_STATE };
        component.payviewState.delivery.methods = null;
        component.payviewState.costs = null;

        fixture.detectChanges();
      });

      it('should not show the summary body', () => {
        const target = debugElement.query(By.directive(PayviewSummaryHeaderComponent));

        expect(target).toBeFalsy();
      });
    });

    describe('WHEN the payment preferences have not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewSummaryOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.payviewState = { ...MOCK_PAYVIEW_STATE };
        component.payviewState.delivery.methods = null;
        component.payviewState.costs = null;
        component.payviewState.payment.preferences.preferences = null;

        fixture.detectChanges();
      });

      it('should not show the summary footer', () => {
        const target = debugElement.query(By.directive(PayviewSummaryHeaderComponent));

        expect(target).toBeFalsy();
      });
    });
  });
});
