import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_BUY_DELIVERY_BANNER_PROPERTIES } from '@fixtures/chat/delivery-banner/delivery-banner.fixtures.spec';
import { BannerComponent } from '@shared/banner/banner.component';
import { ButtonComponent } from '@shared/button/button.component';
import { LottieComponent } from '@shared/lottie/lottie.component';
import { DELIVERY_BANNER_ACTION } from '../../../enums/delivery-banner-action.enum';
import { ActionableDeliveryBanner } from '../../../interfaces/actionable-delivery-banner.interface';
import { PriceableDeliveryBanner } from '../../../interfaces/priceable-delivery-banner.interface';

import { BuyBannerComponent } from './buy-banner.component';
interface BuyBannerTestCase {
  domPosition: number;
  expectedText: string;
}

@Component({
  selector: 'tsl-test-wrapper-buy-banner',
  template: '<tsl-buy-banner [bannerProperties]="bannerProperties" (clickedCTA)="clickedCTA($event)"></tsl-buy-banner>',
})
class TestWrapperBuyBannerComponent {
  @Input() bannerProperties: PriceableDeliveryBanner & ActionableDeliveryBanner = MOCK_BUY_DELIVERY_BANNER_PROPERTIES;
  clickedCTA(_actionType: DELIVERY_BANNER_ACTION): void {}
}

describe('BuyBannerComponent', () => {
  let wrapperComponent: TestWrapperBuyBannerComponent;
  let component: BuyBannerComponent;
  let fixture: ComponentFixture<TestWrapperBuyBannerComponent>;

  const descriptionWrapperSelector = (index: number) => `.BuyBanner__infoElement:nth-of-type(${index})`;
  const descriptionElementsSelector = 'span';
  const descriptionTestCases: BuyBannerTestCase[] = [
    {
      domPosition: 1,
      expectedText: `${$localize`:@@chat_buyer_shipping_enabled_banner_starting_price_description_part_1:Shipping from`} ${
        MOCK_BUY_DELIVERY_BANNER_PROPERTIES.price
      }`,
    },
    {
      domPosition: 2,
      expectedText: `${$localize`:@@chat_buyer_shipping_enabled_banner_refund_guarantee_description_part_1:Shipment`} ${$localize`:@@chat_buyer_shipping_enabled_banner_refund_guarantee_description_part_2:guarantee`}`,
    },
    {
      domPosition: 3,
      expectedText: `${$localize`:@@chat_buyer_shipping_enabled_banner_secure_payment_description_part_1:Payment method`} ${$localize`:@@chat_buyer_shipping_enabled_banner_secure_payment_description_part_2:encrypted and secure`}`,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestWrapperBuyBannerComponent, BuyBannerComponent, BannerComponent, LottieComponent, ButtonComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperBuyBannerComponent);
    wrapperComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(BuyBannerComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display content wrapped in info banner', () => {
    const bannerElement: DebugElement = fixture.debugElement.query(By.css('tsl-banner'));

    expect(bannerElement.componentInstance.specifications.type).toEqual('info');
  });

  describe.each(descriptionTestCases)('when displaying descriptions', (descriptionTestCase) => {
    let descriptionWrapper: DebugElement;
    let descriptionElements: DebugElement[];

    beforeEach(() => {
      descriptionWrapper = fixture.debugElement.query(By.css(descriptionWrapperSelector(descriptionTestCase.domPosition)));
      descriptionElements = descriptionWrapper.queryAll(By.css(descriptionElementsSelector));
    });

    it('should display valid lottie', () => {
      const lottieElement: DebugElement = descriptionWrapper.query(By.directive(LottieComponent));

      expect(lottieElement.componentInstance.src).toEqual(component.lotties[descriptionTestCase.domPosition - 1]);
    });

    it('should display valid description', () => {
      const result: string = descriptionElements.map((element) => element.nativeElement.innerHTML).join('');

      expect(result).toEqual(descriptionTestCase.expectedText);
    });
  });

  it('should display the CTA button', () => {
    const buttonElement: DebugElement = fixture.debugElement.query(By.directive(ButtonComponent));

    expect(buttonElement).toBeTruthy();
  });

  describe('and when the user clicks on the CTA', () => {
    beforeEach(() => {
      spyOn(wrapperComponent, 'clickedCTA');
      const buttonElement: DebugElement = fixture.debugElement.query(By.directive(ButtonComponent));
      buttonElement.nativeElement.click();
    });

    it('should emit the action', () => {
      expect(wrapperComponent.clickedCTA).toHaveBeenCalledTimes(1);
      expect(wrapperComponent.clickedCTA).toHaveBeenCalledWith(MOCK_BUY_DELIVERY_BANNER_PROPERTIES.action);
    });
  });
});
