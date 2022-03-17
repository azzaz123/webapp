import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { DeliveryRadioSelectorComponent } from '@private/shared/delivery-radio-selector/delivery-radio-selector.component';
import { DeliveryRadioSelectorModule } from '@private/shared/delivery-radio-selector/delivery-radio-selector.module';
import { MOCK_DELIVERY_BUYER_DELIVERY_METHODS } from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';
import { MOCK_DELIVERY_COSTS_ITEM } from '@api/fixtures/bff/delivery/costs/delivery-costs.fixtures.spec';
import { Money } from '@api/core/model/money.interface';
import { PayviewDeliveryHeaderComponent } from '@private/features/payview/modules/delivery/components/header/payview-delivery-header.component';
import { PayviewDeliveryPointComponent } from '@private/features/payview/modules/delivery/components/point/payview-delivery-point.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

describe('PayviewDeliveryPointComponent', () => {
  const payviewDeliveryPoint: string = '.PayviewDeliveryPoint';
  const payviewDeliveryPointAddressSelector: string = `${payviewDeliveryPoint}__deliveryAddress`;
  const payviewDeliveryPointAddressWrapperSelector: string = `${payviewDeliveryPoint}__deliveryAddressWrapper`;
  const payviewDeliveryPointCostSelector: string = `${payviewDeliveryPoint}__pointCost > b`;
  const payviewDeliveryPointDescriptionSelector: string = `${payviewDeliveryPoint}__pointDescription`;
  const payviewDeliveryPointDescriptionTitleSelector: string = `${payviewDeliveryPoint}__pointDescription > span`;
  const payviewDeliveryPointInformationWrapperSelector: string = `${payviewDeliveryPoint}__informationWrapper`;

  let component: PayviewDeliveryPointComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewDeliveryPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent, PayviewDeliveryHeaderComponent, PayviewDeliveryPointComponent, SvgIconComponent],
      imports: [BrowserAnimationsModule, DeliveryRadioSelectorModule, HttpClientTestingModule],
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

        describe('WHEN we have deliverty costs', () => {
          it('should have the cost corresponding to the pick-up point method', () => {
            const money: Money = component.deliveryCosts.carrierOfficeCost;
            const expected: string = `${money.amount.toString()}${money.currency.symbol}`;

            const result: boolean = debugElement
              .queryAll(By.css(payviewDeliveryPointCostSelector))
              .some((tag) => tag.nativeElement.innerHTML === expected);

            expect(result).toBe(true);
          });
        });

        describe('WHEN we do not have deliverty costs', () => {
          let changeDetectorRef: ChangeDetectorRef;

          beforeEach(() => {
            changeDetectorRef = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
          });

          it('should have the cost corresponding to the pick-up point method', () => {
            component.deliveryCosts.carrierOfficeCost = null;
            const money: Money = component.deliveryCosts.carrierOfficeCost;
            const expected: string = ``;

            changeDetectorRef.detectChanges();

            const result: boolean = debugElement
              .queryAll(By.css(payviewDeliveryPointCostSelector))
              .some((tag) => tag.nativeElement.innerHTML === expected);

            expect(result).toBe(true);
          });
        });

        describe('WHEN the delivery method is selected', () => {
          beforeEach(() => {
            fixture = TestBed.createComponent(PayviewDeliveryPointComponent);
            component = fixture.componentInstance;
            debugElement = fixture.debugElement;

            component.deliveryCosts = MOCK_DELIVERY_COSTS_ITEM;
            component.deliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[0];
            component.isChecked = true;

            fixture.detectChanges();
          });

          it('should show the delivery expectation', () => {
            const target = debugElement.query(By.css(payviewDeliveryPointInformationWrapperSelector));

            expect(target).toBeTruthy();
          });

          describe('WHEN there is previous pick-up point selected', () => {
            it('should show the pick-up point address', () => {
              const target = debugElement.query(By.css(payviewDeliveryPointAddressWrapperSelector));

              expect(target).toBeTruthy();
            });

            it('should show a button with "View pick-up points" message', () => {
              const expected: string = $localize`:@@pay_view_buyer_delivery_method_po_selector_edit_button:Edit pick-up point`;

              expect(component.actionTitle).toBe(expected);
            });
          });

          describe('WHEN there is not previous pick-up point selected', () => {
            beforeEach(() => {
              fixture = TestBed.createComponent(PayviewDeliveryPointComponent);
              component = fixture.componentInstance;
              debugElement = fixture.debugElement;

              component.deliveryCosts = MOCK_DELIVERY_COSTS_ITEM;
              component.deliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[0];
              component.deliveryMethod.lastAddressUsed = null;
              component.isChecked = true;

              fixture.detectChanges();
            });

            it('should not show the pick-up point address', () => {
              const target = debugElement.query(By.css(payviewDeliveryPointAddressWrapperSelector));

              expect(target).toBeFalsy();
            });

            it('should show a button with "View pick-up points" message', () => {
              const expected: string = $localize`:@@pay_view_buyer_delivery_method_po_selector_select_button:View pick-up points`;

              expect(component.actionTitle).toBe(expected);
            });
          });
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

        describe('WHEN we do not have deliverty costs', () => {
          let changeDetectorRef: ChangeDetectorRef;

          beforeEach(() => {
            changeDetectorRef = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
          });

          it('should have the cost corresponding to the pick-up point method', () => {
            component.deliveryCosts.buyerAddressCost = null;
            const money: Money = component.deliveryCosts.buyerAddressCost;
            const expected: string = ``;

            changeDetectorRef.detectChanges();

            const result: boolean = debugElement
              .queryAll(By.css(payviewDeliveryPointCostSelector))
              .some((tag) => tag.nativeElement.innerHTML === expected);

            expect(result).toBe(true);
          });
        });

        describe('WHEN the delivery method is selected', () => {
          beforeEach(() => {
            fixture = TestBed.createComponent(PayviewDeliveryPointComponent);
            component = fixture.componentInstance;
            debugElement = fixture.debugElement;

            component.deliveryCosts = MOCK_DELIVERY_COSTS_ITEM;
            component.deliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[1];
            component.isChecked = true;

            fixture.detectChanges();
          });

          it('should show the delivery expectation', () => {
            const target = debugElement.query(By.css(payviewDeliveryPointInformationWrapperSelector));

            expect(target).toBeTruthy();
          });

          describe('WHEN there is previous home pick-up selected', () => {
            it('should show the home pick-up address', () => {
              const target = debugElement.query(By.css(payviewDeliveryPointAddressWrapperSelector));

              expect(target).toBeTruthy();
            });

            it('should show a button with "Edit address" message', () => {
              const expected: string = $localize`:@@pay_view_buyer_delivery_method_ba_selector_select_button:Edit address`;

              expect(component.actionTitle).toBe(expected);
            });
          });

          describe('WHEN there is not previous home pick-up selected', () => {
            beforeEach(() => {
              fixture = TestBed.createComponent(PayviewDeliveryPointComponent);
              component = fixture.componentInstance;
              debugElement = fixture.debugElement;

              component.deliveryCosts = MOCK_DELIVERY_COSTS_ITEM;
              component.deliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[1];
              component.deliveryMethod.lastAddressUsed = null;
              component.isChecked = true;

              fixture.detectChanges();
            });

            it('should not show the pick-up address', () => {
              const target = debugElement.query(By.css(payviewDeliveryPointAddressWrapperSelector));

              expect(target).toBeFalsy();
            });

            it('should show a button with "Add address" message', () => {
              const expected: string = $localize`:@@pay_view_buyer_delivery_method_ba_selector_select_button:Add address`;

              expect(component.actionTitle).toBe(expected);
            });
          });
        });
      });
    });
  });

  describe('WHEN the item has been selected', () => {
    const fakeIndex: number = 13;

    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewDeliveryPointComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      spyOn(component.checked, 'emit');

      component.deliveryCosts = MOCK_DELIVERY_COSTS_ITEM;
      component.deliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[0];
      component.id = fakeIndex;

      fixture.detectChanges();

      const deliveryOptionSelector: DebugElement = fixture.debugElement.query(By.directive(DeliveryRadioSelectorComponent));
      deliveryOptionSelector.triggerEventHandler('changed', null);
    });

    it('should emit the selected index', () => {
      expect(component.checked.emit).toHaveBeenCalledTimes(1);
      expect(component.checked.emit).toHaveBeenCalledWith(fakeIndex);
    });
  });

  describe('WHEN the user clicks over the button', () => {
    const fakeIndex: number = 13;

    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewDeliveryPointComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      spyOn(component.edited, 'emit');

      component.deliveryCosts = MOCK_DELIVERY_COSTS_ITEM;
      component.deliveryMethod = MOCK_DELIVERY_BUYER_DELIVERY_METHODS.deliveryMethods[0];
      component.id = fakeIndex;
      component.isChecked = true;

      fixture.detectChanges();

      const deliveryButtonSelector: DebugElement = fixture.debugElement.query(By.directive(ButtonComponent));
      deliveryButtonSelector.triggerEventHandler('click', null);
    });

    it('should emit the selected index', () => {
      expect(component.edited.emit).toHaveBeenCalledTimes(1);
      expect(component.edited.emit).toHaveBeenCalledWith(fakeIndex);
    });
  });
});
