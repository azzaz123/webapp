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

  const descriptionSelector = '.BuyBanner__description';
  const priceSelector = '.BuyBanner__price';

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

  it('should display a lottie with valid URL', () => {
    const lottieElement: DebugElement = fixture.debugElement.query(By.directive(LottieComponent));

    expect(lottieElement.componentInstance.src).toEqual(component.lottie);
  });

  it('should display the text from the description', () => {
    const descriptionTextElement: DebugElement = fixture.debugElement.query(By.css(descriptionSelector));
    const expectedText: string = $localize`:@@chat_buyer_shipping_enabled_banner_starting_price_description_part_1:Shipping from`;

    expect(descriptionTextElement.nativeElement.innerHTML).toEqual(expectedText);
  });

  it('should display the price', () => {
    const priceElement: DebugElement = fixture.debugElement.query(By.css(priceSelector));

    expect(priceElement.nativeElement.innerHTML).toEqual(MOCK_BUY_DELIVERY_BANNER_PROPERTIES.price.toString());
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
