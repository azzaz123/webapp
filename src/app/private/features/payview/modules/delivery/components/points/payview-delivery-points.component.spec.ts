import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { DeliveryRadioSelectorModule } from '@private/shared/delivery-radio-selector/delivery-radio-selector.module';
import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { MOCK_DELIVERY_COSTS_ITEM } from '@api/fixtures/bff/delivery/costs/delivery-costs.fixtures.spec';
import { PayviewDeliveryHeaderComponent } from '@private/features/payview/modules/delivery/components/header/payview-delivery-header.component';
import { PayviewDeliveryPointComponent } from '@private/features/payview/modules/delivery/components/point/payview-delivery-point.component';
import { PayviewDeliveryPointsComponent } from '@private/features/payview/modules/delivery/components/points/payview-delivery-points.component';
import { PayviewDeliveryService } from '@private/features/payview/modules/delivery/services/payview-delivery.service';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

describe('PayviewDeliveryPointsComponent', () => {
  const payviewDeliveryPoints: string = '.PayviewDeliveryPoints';

  let component: PayviewDeliveryPointsComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewDeliveryPointsComponent>;
  let payviewDeliveryService: PayviewDeliveryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ButtonComponent,
        PayviewDeliveryHeaderComponent,
        PayviewDeliveryPointComponent,
        PayviewDeliveryPointsComponent,
        SvgIconComponent,
      ],
      imports: [DeliveryRadioSelectorModule, HttpClientTestingModule],
      providers: [PayviewDeliveryService],
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
        const target = debugElement.queryAll(By.directive(PayviewDeliveryPointComponent)).length;

        expect(target).toBe(component.deliveryMethods.length);
      });

      describe('WHEN the delivery method is pick-up point', () => {
        let targetElement: DebugElement;

        beforeEach(() => {
          targetElement = debugElement.queryAll(By.directive(PayviewDeliveryPointComponent))[0];
        });

        it('should assign the corresponding delivery costs', () => {
          expect(targetElement.componentInstance.deliveryCosts).toEqual(MOCK_DELIVERY_COSTS_ITEM);
        });

        it('should assign the corresponding delivery method', () => {
          expect(targetElement.componentInstance.deliveryMethod).toEqual(MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[0]);
        });

        it('should assign the corresponding id', () => {
          expect(targetElement.componentInstance.id).toEqual(0);
        });

        it('should assign whether is checked or not', () => {
          expect(targetElement.componentInstance.isChecked).toBeFalsy();
        });
      });

      describe('WHEN the delivery method is home pick-up', () => {
        let targetElement: DebugElement;

        beforeEach(() => {
          targetElement = debugElement.queryAll(By.directive(PayviewDeliveryPointComponent))[1];
        });

        it('should assign the corresponding delivery costs', () => {
          expect(targetElement.componentInstance.deliveryCosts).toEqual(MOCK_DELIVERY_COSTS_ITEM);
        });

        it('should assign the corresponding delivery method', () => {
          expect(targetElement.componentInstance.deliveryMethod).toEqual(MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[1]);
        });

        it('should assign the corresponding id', () => {
          expect(targetElement.componentInstance.id).toEqual(1);
        });

        it('should assign whether is checked or not', () => {
          expect(targetElement.componentInstance.isChecked).toBeFalsy();
        });
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

  describe('WHEN the item has been selected', () => {
    let deliveryServiceSpy;
    const fakeIndex: number = 1;

    beforeEach(() => {
      payviewDeliveryService = TestBed.inject(PayviewDeliveryService);
      deliveryServiceSpy = spyOn(payviewDeliveryService, 'setDeliveryMethod').and.callFake(() => {});
      fixture = TestBed.createComponent(PayviewDeliveryPointsComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      component.deliveryCosts = MOCK_DELIVERY_COSTS_ITEM;
      component.deliveryMethods = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods;

      fixture.detectChanges();

      const deliveryOptionSelector: DebugElement = fixture.debugElement.query(By.directive(PayviewDeliveryPointComponent));
      deliveryOptionSelector.triggerEventHandler('checked', fakeIndex);
    });

    it('should indicate that the item is selected', () => {
      expect(component.isSelected(fakeIndex)).toBe(true);
    });

    it('should set the delivery method selected', () => {
      expect(deliveryServiceSpy).toHaveBeenCalledTimes(1);
      expect(deliveryServiceSpy).toHaveBeenCalledWith(component.deliveryMethods[fakeIndex]);
    });
  });

  describe('WHEN the edit point has been called', () => {
    describe('AND WHEN the edit point is the pick-up point', () => {
      let deliveryServiceSpy;

      beforeEach(() => {
        deliveryServiceSpy = spyOn(payviewDeliveryService, 'editPickUpPoint').and.callFake(() => {});

        fixture.detectChanges();
      });

      it('should raise the event corresponding to the pick-up point edition', () => {
        component.editPoint(0);
        expect(deliveryServiceSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('AND WHEN the edit point is the address', () => {
      let deliveryServiceSpy;

      beforeEach(() => {
        deliveryServiceSpy = spyOn(payviewDeliveryService, 'editAddress').and.callFake(() => {});

        fixture.detectChanges();
      });

      it('should raise the event corresponding to the address edition', () => {
        component.editPoint(1);
        expect(deliveryServiceSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('WHEN any point has been selected', () => {
    let deliveryServiceSpy;

    beforeEach(() => {
      deliveryServiceSpy = spyOn(payviewDeliveryService, 'setDeliveryMethod').and.callFake(() => {});

      fixture.detectChanges();
    });

    it('should raise the event corresponding to the delivery method selection', () => {
      component.selectPoint(1);
      expect(deliveryServiceSpy).toHaveBeenCalledTimes(1);
      expect(deliveryServiceSpy).toHaveBeenCalledWith(component.deliveryMethods[1]);
    });
  });
});
