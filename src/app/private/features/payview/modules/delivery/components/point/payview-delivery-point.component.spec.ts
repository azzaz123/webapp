import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DeliveryRadioSelectorModule } from '@private/shared/delivery-radio-selector/delivery-radio-selector.module';
import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { MOCK_DELIVERY_COSTS_ITEM } from '@api/fixtures/bff/delivery/costs/delivery-costs.fixtures.spec';
import { Money } from '@api/core/model/money.interface';
import { PayviewDeliveryHeaderComponent } from '@private/features/payview/modules/delivery/components/header/payview-delivery-header.component';
import { PayviewDeliveryPointComponent } from '@private/features/payview/modules/delivery/components/point/payview-delivery-point.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

describe('PayviewDeliveryPointComponent', () => {
  const payviewDeliveryPoint: string = '.PayviewDeliveryPoint';
  const payviewDeliveryPointCostSelector: string = `${payviewDeliveryPoint}__pointCost > b`;
  const payviewDeliveryPointDescriptionSelector: string = `${payviewDeliveryPoint}__pointDescription`;
  const payviewDeliveryPointDescriptionTitleSelector: string = `${payviewDeliveryPoint}__pointDescription > span`;

  let component: PayviewDeliveryPointComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewDeliveryPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewDeliveryHeaderComponent, PayviewDeliveryPointComponent, SvgIconComponent],
      imports: [DeliveryRadioSelectorModule, HttpClientTestingModule],
    }).compileComponents();
  });

  describe('WHEN initializes', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewDeliveryPointComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      component.deliveryCosts = MOCK_DELIVERY_COSTS_ITEM;
      component.deliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[0];

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('WHEN the delivery method has been reported', () => {
      describe('WHEN the delivery method is pick-up point', () => {
        beforeEach(() => {
          fixture = TestBed.createComponent(PayviewDeliveryPointComponent);
          component = fixture.componentInstance;
          debugElement = fixture.debugElement;

          component.deliveryCosts = MOCK_DELIVERY_COSTS_ITEM;
          component.deliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[0];

          fixture.detectChanges();
        });

        it('should show the delivery method', () => {
          const target = debugElement.query(By.css(payviewDeliveryPointDescriptionSelector));

          expect(target).toBeTruthy();
        });

        it('should have a pick-up point method', () => {
          const expected: string = $localize`:@@pay_view_buyer_delivery_method_po_selector_title:Pick-up point`;

          const result: boolean = debugElement
            .queryAll(By.css(payviewDeliveryPointDescriptionTitleSelector))
            .some((tag) => tag.nativeElement.innerHTML === expected);

          expect(result).toBe(true);
        });

        it('should have the cost corresponding to the pick-up point method', () => {
          const money: Money = component.deliveryCosts.carrierOfficeCost;
          const expected: string = `${money.amount.toString()}${money.currency.symbol}`;

          const result: boolean = debugElement
            .queryAll(By.css(payviewDeliveryPointCostSelector))
            .some((tag) => tag.nativeElement.innerHTML === expected);

          expect(result).toBe(true);
        });
      });

      describe('WHEN the delivery method is home pick-up', () => {
        beforeEach(() => {
          fixture = TestBed.createComponent(PayviewDeliveryPointComponent);
          component = fixture.componentInstance;
          debugElement = fixture.debugElement;

          component.deliveryCosts = MOCK_DELIVERY_COSTS_ITEM;
          component.deliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[1];

          fixture.detectChanges();
        });

        it('should show the delivery method', () => {
          const target = debugElement.query(By.css(payviewDeliveryPointDescriptionSelector));

          expect(target).toBeTruthy();
        });

        it('should have a home delivery method', () => {
          const expected: string = $localize`:@@pay_view_buyer_delivery_method_ba_selector_title:My address`;

          const result: boolean = debugElement
            .queryAll(By.css(payviewDeliveryPointDescriptionTitleSelector))
            .some((tag) => tag.nativeElement.innerHTML === expected);

          expect(result).toBe(true);
        });

        it('should have the cost corresponding to the home delivery method', () => {
          const money: Money = component.deliveryCosts.buyerAddressCost;
          const expected: string = `${money.amount.toString()}${money.currency.symbol}`;

          const result: boolean = debugElement
            .queryAll(By.css(payviewDeliveryPointCostSelector))
            .some((tag) => tag.nativeElement.innerHTML === expected);

          expect(result).toBe(true);
        });
      });
    });
  });
});
