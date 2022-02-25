import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DeliveryRadioSelectorModule } from '@private/shared/delivery-radio-selector/delivery-radio-selector.module';
import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { MOCK_DELIVERY_COSTS_ITEM } from '@api/fixtures/bff/delivery/costs/delivery-costs.fixtures.spec';
import { Money } from '@api/core/model/money.interface';
import { PayviewDeliveryHeaderComponent } from '@private/features/payview/modules/delivery/components/header/payview-delivery-header.component';
import { PayviewDeliveryPointsComponent } from '@private/features/payview/modules/delivery/components/points/payview-delivery-points.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

describe('PayviewDeliveryPointsComponent', () => {
  const payviewDeliveryPoints: string = '.PayviewDeliveryPoints';
  const payviewDeliveryPointCostSelector: string = `${payviewDeliveryPoints}__pointCost > b`;
  const payviewDeliveryPointDescriptionSelector: string = `${payviewDeliveryPoints}__pointDescription`;
  const payviewDeliveryPointDescriptionTitleSelector: string = `${payviewDeliveryPoints}__pointDescription > span`;

  let component: PayviewDeliveryPointsComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewDeliveryPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewDeliveryHeaderComponent, PayviewDeliveryPointsComponent, SvgIconComponent],
      imports: [DeliveryRadioSelectorModule, HttpClientTestingModule],
    }).compileComponents();
  });

  describe('WHEN initializes', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewDeliveryPointsComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('WHEN the delivery methods have been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewDeliveryPointsComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.deliveryCosts = MOCK_DELIVERY_COSTS_ITEM;
        component.deliveryMethods = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods;

        fixture.detectChanges();
      });

      it('should show all the delivery methods', () => {
        const target = debugElement.queryAll(By.css(payviewDeliveryPointDescriptionSelector)).length;

        expect(target).toBe(component.deliveryMethods.length);
      });

      it('should have a pick-up point method', () => {
        const expected: string = $localize`:@@pay_view_buyer_delivery_method_po_selector_title:Pick-up point`;

        const result: boolean = debugElement
          .queryAll(By.css(payviewDeliveryPointDescriptionTitleSelector))
          .some((tag) => tag.nativeElement.innerHTML === expected);

        expect(result).toBe(true);
      });

      it('should have a home delivery method', () => {
        const expected: string = $localize`:@@pay_view_buyer_delivery_method_ba_selector_title:My address`;

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

      it('should have the cost corresponding to the home delivery method', () => {
        const money: Money = component.deliveryCosts.buyerAddressCost;
        const expected: string = `${money.amount.toString()}${money.currency.symbol}`;

        const result: boolean = debugElement
          .queryAll(By.css(payviewDeliveryPointCostSelector))
          .some((tag) => tag.nativeElement.innerHTML === expected);

        expect(result).toBe(true);
      });
    });

    describe('WHEN the delivery methods have not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewDeliveryPointsComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.deliveryMethods = null;

        fixture.detectChanges();
      });

      it('should not show any delivery method', () => {
        const target = debugElement.query(By.css(payviewDeliveryPoints));

        expect(target).toBeFalsy();
      });
    });

    describe('WHEN the delivery costs have not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewDeliveryPointsComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.deliveryCosts = null;
        component.deliveryMethods = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods;

        fixture.detectChanges();
      });

      it('should not show any delivery method', () => {
        const target = debugElement.query(By.css(payviewDeliveryPoints));

        expect(target).toBeFalsy();
      });
    });
  });
});
