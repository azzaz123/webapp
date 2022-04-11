import { By } from '@angular/platform-browser';
import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import {
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION,
} from '@api/fixtures/delivery/buyer/delivery-buyer-calculator-costs-dto.fixtures.spec';
import { PayviewSummaryCostDetailComponent } from '@private/features/payview/modules/summary/components/cost-detail/payview-summary-cost-detail.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

describe('PayviewSummaryCostDetailComponent', () => {
  const fakeProductName: string = 'This is a product name';
  const payviewSummaryCostDetailSelector: string = '.PayviewSummaryCostDetail';
  const payviewSummaryCostDetailInsuranceBadgeSelector: string = `${payviewSummaryCostDetailSelector}__insuranceBadge`;
  const payviewSummaryCostDetailInsuranceCostSelector: string = `${payviewSummaryCostDetailSelector}__insuranceCost`;
  const payviewSummaryCostDetailInsuranceDiscountSelector: string = `${payviewSummaryCostDetailSelector}__insuranceDiscount`;
  const payviewSummaryCostDetailInsuranceTitleSelector: string = `${payviewSummaryCostDetailSelector}__insuranceTitle`;
  const payviewSummaryCostDetailProductCostSelector: string = `${payviewSummaryCostDetailSelector}__productCost`;
  const payviewSummaryCostDetailProductNameSelector: string = `${payviewSummaryCostDetailSelector}__productName`;
  const payviewSummaryCostDetailShippingBadgeSelector: string = `${payviewSummaryCostDetailSelector}__shippingBadge`;
  const payviewSummaryCostDetailShippingCostSelector: string = `${payviewSummaryCostDetailSelector}__shippingCost`;
  const payviewSummaryCostDetailShippingDiscountSelector: string = `${payviewSummaryCostDetailSelector}__shippingDiscount`;
  const payviewSummaryCostDetailShippingTitleSelector: string = `${payviewSummaryCostDetailSelector}__shippingTitle`;
  const payviewSummaryCostDetailTotalCostSelector: string = `${payviewSummaryCostDetailSelector}__totalCost`;
  const payviewSummaryCostDetailTotalTitleSelector: string = `${payviewSummaryCostDetailSelector}__totalTitle`;

  let component: PayviewSummaryCostDetailComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewSummaryCostDetailComponent>;
  let changeDetectorRef: ChangeDetectorRef;

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
    changeDetectorRef = debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
  });

  describe('WHEN it initializes', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('WHEN there is some input missing', () => {
      describe('WHEN there are no costs', () => {
        beforeEach(() => {
          component.costs = null;
          component.productName = fakeProductName;

          fixture.detectChanges();
        });

        it('should not show the cost detail block', () => {
          const target = debugElement.query(By.css(payviewSummaryCostDetailSelector));

          expect(target).toBeFalsy();
        });
      });

      describe('WHEN there are no product name', () => {
        beforeEach(() => {
          component.costs = { ...MOCK_DELIVERY_BUYER_CALCULATOR_COSTS };
          component.productName = null;

          fixture.detectChanges();
        });

        it('should not show the cost detail block', () => {
          const target = debugElement.query(By.css(payviewSummaryCostDetailSelector));

          expect(target).toBeFalsy();
        });
      });
    });

    describe('WHEN there are costs and product name', () => {
      const fakeProductName: string = 'This_is_a_fake_product_name';

      beforeEach(() => {
        component.costs = { ...MOCK_DELIVERY_BUYER_CALCULATOR_COSTS };
        component.productName = fakeProductName;

        fixture.detectChanges();
      });

      it('should show the cost detail block', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailSelector));

        expect(target).toBeTruthy();
      });

      it('should show the product name', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailProductNameSelector));

        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(fakeProductName);
      });

      it('should show the product cost', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailProductCostSelector));

        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.productPrice.amount.toString()
        );
        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.productPrice.currency
        );
      });

      it('should show the insurance title', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailInsuranceTitleSelector));

        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          $localize`:@@pay_view_buyer_summary_insurance_label:Insurance`
        );
      });

      it('should show the insurance cost', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailInsuranceCostSelector));

        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.fees.amount.toString()
        );
        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.fees.currency);
      });

      it('should not show the insurance badge', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailInsuranceBadgeSelector));

        expect(target).toBeFalsy();
      });

      it('should not show the insurance discount', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailInsuranceDiscountSelector));

        expect(target).toBeFalsy();
      });

      it('should show the shipping title', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailShippingTitleSelector));

        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain($localize`:@@pay_view_buyer_summary_shipping_label:Delivery`);
      });

      it('should show the shipping cost', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailShippingCostSelector));

        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.deliveryCost.amount.toString()
        );
        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.deliveryCost.currency
        );
      });

      it('should show the total title', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailTotalTitleSelector));

        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain($localize`:@@pay_view_buyer_summary_total_label:Total`);
      });

      it('should show the total cost', () => {
        const target = debugElement.query(By.css(payviewSummaryCostDetailTotalCostSelector));

        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.total.amount.toString()
        );
        expect((target.nativeElement as HTMLSpanElement).innerHTML).toContain(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS.buyerCost.total.currency
        );
      });

      describe('WHEN there is insurance discount', () => {
        beforeEach(() => {
          component.costs = { ...MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION };
          component.productName = fakeProductName;

          changeDetectorRef.detectChanges();
        });

        it('should show the insurance badge', () => {
          const expected = component.costs.promotion.feesFixedPrice;
          const target: HTMLSpanElement = debugElement.query(By.css(payviewSummaryCostDetailInsuranceBadgeSelector)).nativeElement;

          expect(target).toBeTruthy();
          expect(target.innerHTML).toContain(`${expected.toString()}`);
        });

        it('should show the insurance discount', () => {
          const expected = component.costs.promotion.originalBuyerCost.fees;
          const target: HTMLSpanElement = debugElement.query(By.css(payviewSummaryCostDetailInsuranceDiscountSelector)).nativeElement;

          expect(target).toBeTruthy();
          expect(target.innerHTML).toContain(`${expected.toString()}`);
        });
      });

      describe('WHEN there is shipping discount', () => {
        beforeEach(() => {
          component.costs = { ...MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION };
          component.productName = fakeProductName;

          changeDetectorRef.detectChanges();
        });

        it('should show the shipping discount', () => {
          const expected = component.costs.promotion.originalBuyerCost.deliveryCost;
          const target: HTMLSpanElement = debugElement.query(By.css(payviewSummaryCostDetailShippingDiscountSelector)).nativeElement;

          expect(target).toBeTruthy();
          expect(target.innerHTML).toContain(`${expected.toString()}`);
        });

        describe('WHEN the discount is a percentage', () => {
          it('should show the shipping badge', () => {
            const expected = component.costs.promotion.deliveryCostDiscountPercentage;
            const target: HTMLSpanElement = debugElement.query(By.css(payviewSummaryCostDetailShippingBadgeSelector)).nativeElement;

            expect(target).toBeTruthy();
            expect(target.innerHTML).toContain(`${expected.toString()}%`);
          });
        });

        describe('WHEN the discount is fixed', () => {
          beforeEach(() => {
            component.costs.promotion.deliveryCostDiscountPercentage = 0;

            changeDetectorRef.detectChanges();
          });

          it('should show the shipping badge', () => {
            const expected = component.costs.promotion.deliveryCostFixedPrice;
            const target: HTMLSpanElement = debugElement.query(By.css(payviewSummaryCostDetailShippingBadgeSelector)).nativeElement;

            expect(target).toBeTruthy();
            expect(target.innerHTML).toContain(`${expected.toString()}`);
          });
        });
      });
    });
  });

  describe('WHEN the promotion is free insurance', () => {
    beforeEach(() => {
      component.productName = fakeProductName;
      component.costs = { ...MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION };
      component.costs.promotion.feesFixedPrice.amount.total = 0;

      changeDetectorRef.detectChanges();
    });

    it('should show the message "free"', () => {
      const expected = $localize`:@@pay_view_buyer_summary_payment_free_badge:Free`;
      const target = debugElement.query(By.css(payviewSummaryCostDetailInsuranceBadgeSelector)).nativeElement;

      expect(target.innerHTML).toBe(expected);
    });
  });

  describe('WHEN there is no fees insurance ', () => {
    beforeEach(() => {
      component.productName = fakeProductName;
      component.costs = { ...MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION };
      component.costs.promotion.feesFixedPrice = null;

      changeDetectorRef.detectChanges();
    });

    it('should not show the insurance badge', () => {
      const target = debugElement.query(By.css(payviewSummaryCostDetailInsuranceBadgeSelector));

      expect(target).toBeFalsy();
    });
  });

  describe('WHEN the promotion is free delivery', () => {
    describe('WHEN the fixed price is zero', () => {
      beforeEach(() => {
        component.productName = fakeProductName;
        component.costs = { ...MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION };
        component.costs.promotion.deliveryCostFixedPrice.amount.total = 0;

        changeDetectorRef.detectChanges();
      });

      it('should show the message "free"', () => {
        const expected = $localize`:@@pay_view_buyer_summary_payment_free_badge:Free`;
        const target = debugElement.query(By.css(payviewSummaryCostDetailShippingBadgeSelector)).nativeElement;

        expect(target.innerHTML).toBe(expected);
      });
    });

    describe('WHEN the discount percentage is 100', () => {
      beforeEach(() => {
        component.productName = fakeProductName;
        component.costs = { ...MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION };
        component.costs.promotion.deliveryCostFixedPrice = null;
        component.costs.promotion.deliveryCostDiscountPercentage = 100;

        changeDetectorRef.detectChanges();
      });

      it('should show the message "free"', () => {
        const expected = $localize`:@@pay_view_buyer_summary_payment_free_badge:Free`;
        const target = debugElement.query(By.css(payviewSummaryCostDetailShippingBadgeSelector)).nativeElement;

        expect(target.innerHTML).toBe(expected);
      });
    });
  });

  describe('WHEN there is no shipping costs ', () => {
    beforeEach(() => {
      component.productName = fakeProductName;
      component.costs = { ...MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION };
      component.costs.promotion.deliveryCostFixedPrice = null;
      component.costs.promotion.deliveryCostDiscountPercentage = 0;

      changeDetectorRef.detectChanges();
    });

    it('should not show the shipping badge', () => {
      const target = debugElement.query(By.css(payviewSummaryCostDetailShippingBadgeSelector));

      expect(target).toBeFalsy();
    });
  });

  describe('WHEN there is no promotion ', () => {
    beforeEach(() => {
      component.productName = fakeProductName;
      component.costs = { ...MOCK_DELIVERY_BUYER_CALCULATOR_COSTS };

      changeDetectorRef.detectChanges();
    });

    it('should not show the insurance badge', () => {
      const target = debugElement.query(By.css(payviewSummaryCostDetailInsuranceBadgeSelector));

      expect(target).toBeFalsy();
    });

    it('should not show the shipping badge', () => {
      const target = debugElement.query(By.css(payviewSummaryCostDetailShippingBadgeSelector));

      expect(target).toBeFalsy();
    });
  });
});
