import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MOCK_DELIVERY_BUYER_CALCULATOR_COSTS } from '@api/fixtures/delivery/buyer/delivery-buyer-calculator-costs-dto.fixtures.spec';
import { PayviewSummaryCostDetailComponent } from '@private/features/payview/modules/summary/components/cost-detail/payview-summary-cost-detail.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

describe('PayviewSummaryCostDetailComponent', () => {
  const payviewSummaryCostDetail: string = '.PayviewSummaryCostDetail';
  const payviewSummaryCostDetailProductName: string = `${payviewSummaryCostDetail}__productName`;
  const payviewSummaryCostDetailProductCost: string = `${payviewSummaryCostDetail}__productCost`;
  const payviewSummaryCostDetailInsuranceTitle: string = `${payviewSummaryCostDetail}__insuranceTitle`;
  const payviewSummaryCostDetailInsuranceCost: string = `${payviewSummaryCostDetail}__insuranceCost`;
  const payviewSummaryCostDetailShippingTitle: string = `${payviewSummaryCostDetail}__shippingTitle`;
  const payviewSummaryCostDetailShippingCost: string = `${payviewSummaryCostDetail}__shippingCost`;
  const payviewSummaryCostDetailTotalTitle: string = `${payviewSummaryCostDetail}__totalTitle`;
  const payviewSummaryCostDetailTotalCost: string = `${payviewSummaryCostDetail}__totalCost`;

  let component: PayviewSummaryCostDetailComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewSummaryCostDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewSummaryCostDetailComponent, SvgIconComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayviewSummaryCostDetailComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  describe('WHEN it initializes', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('WHEN there is some input missing', () => {
      describe('WHEN there are no costs', () => {
        beforeEach(() => {
          component.costs = null;
          component.productName = 'This is a product name';

          fixture.detectChanges();
        });

        it('should not show the cost detail block', () => {
          const target = debugElement.query(By.css(payviewSummaryCostDetail));

          expect(target).toBeFalsy();
        });
      });

      describe('WHEN there are no product name', () => {
        beforeEach(() => {
          component.costs = MOCK_DELIVERY_BUYER_CALCULATOR_COSTS;
          component.productName = null;

          fixture.detectChanges();
        });

        it('should not show the cost detail block', () => {
          const target = debugElement.query(By.css(payviewSummaryCostDetail));

          expect(target).toBeFalsy();
        });
      });
    });

    describe('WHEN there are costs and product name', () => {
      const fakeProductName: string = 'This_is_a_fake_product_name';

      beforeEach(() => {
        component.costs = MOCK_DELIVERY_BUYER_CALCULATOR_COSTS;
        component.productName = fakeProductName;

        fixture.detectChanges();
      });

      it('should show the cost detail block', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetail));

        expect(target).toBeTruthy();
      });

      it('should show the product name', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailProductName));

        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(fakeProductName);
      });

      it('should show the product cost', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailProductCost));

        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.productPrice.amount.toString()
        );
        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.productPrice.currency.symbol.toString()
        );
      });

      it('should show the insurance title', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailInsuranceTitle));

        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          $localize`:@@web_pay_view_buyer_summary_insurance_label:Seguro`
        );
      });

      it('should show the insurance cost', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailInsuranceCost));

        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.fees.amount.toString()
        );
        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.fees.currency.symbol.toString()
        );
      });

      it('should show the shipping title', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailShippingTitle));

        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain($localize`:@@pay_view_buyer_summary_shipping_label:Envío`);
      });

      it('should show the shipping cost', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailShippingCost));

        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.deliveryCost.amount.toString()
        );
        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.deliveryCost.currency.symbol.toString()
        );
      });

      it('should show the total title', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailTotalTitle));

        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain($localize`:@@pay_view_buyer_summary_total_label:Total`);
      });

      it('should show the total cost', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailTotalCost));

        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.total.amount.toString()
        );
        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.total.currency.symbol.toString()
        );
      });
    });
  });
});
