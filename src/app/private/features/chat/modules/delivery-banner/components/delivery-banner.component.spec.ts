import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_BUY_DELIVERY_BANNER_PROPERTIES } from '@fixtures/chat/delivery-banner/delivery-banner.fixtures.spec';
import { SELLER_EDIT_PRICE_BANNER_PROPERTIES } from '../constants/delivery-banner-configs';
import { DELIVERY_BANNER_ACTION } from '../enums/delivery-banner-action.enum';
import { DeliveryBanner } from '../interfaces/delivery-banner.interface';
import { BuyBannerComponent } from './banners/buy-banner/buy-banner.component';
import { EditPriceBannerComponent } from './banners/edit-price-banner/edit-price-banner.component';

import { DeliveryBannerComponent } from './delivery-banner.component';

@Component({
  selector: 'tsl-test-wrapper-delivery-banner',
  template: '<tsl-delivery-banner [bannerProperties]="bannerProperties" (clickedCTA)="clickedCTA($event)"></tsl-delivery-banner>',
})
class TestWrapperDeliveryBannerComponent {
  @Input() bannerProperties: DeliveryBanner = MOCK_BUY_DELIVERY_BANNER_PROPERTIES;
  clickedCTA(_actionType: DELIVERY_BANNER_ACTION): void {}
}

describe('DeliveryBannerComponent', () => {
  let component: TestWrapperDeliveryBannerComponent;
  let fixture: ComponentFixture<TestWrapperDeliveryBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TestWrapperDeliveryBannerComponent, DeliveryBannerComponent, BuyBannerComponent, EditPriceBannerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperDeliveryBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when buy banner needs to be displayed', () => {
    let buyBannerElement: DebugElement;

    beforeEach(() => {
      component.bannerProperties = MOCK_BUY_DELIVERY_BANNER_PROPERTIES;
      fixture.detectChanges();
      buyBannerElement = fixture.debugElement.query(By.directive(BuyBannerComponent));
    });

    it('should display buy banner', () => {
      expect(buyBannerElement).toBeTruthy();
    });

    it('should set banner properties to buy banner', () => {
      const buyBannerInstance: BuyBannerComponent = buyBannerElement.componentInstance;

      expect(buyBannerInstance.bannerProperties).toEqual(MOCK_BUY_DELIVERY_BANNER_PROPERTIES);
    });

    describe('when user clicks on banner', () => {
      beforeEach(() => {
        spyOn(component, 'clickedCTA');
        buyBannerElement.triggerEventHandler('clickedCTA', MOCK_BUY_DELIVERY_BANNER_PROPERTIES.action);
      });

      it('should notify user clicked on banner', () => {
        expect(component.clickedCTA).toHaveBeenCalledTimes(1);
        expect(component.clickedCTA).toHaveBeenCalledWith(MOCK_BUY_DELIVERY_BANNER_PROPERTIES.action);
      });
    });
  });

  describe('when edit price banner needs to be displayed', () => {
    let editPriceBannerElement: DebugElement;

    beforeEach(() => {
      component.bannerProperties = SELLER_EDIT_PRICE_BANNER_PROPERTIES;
      fixture.detectChanges();
      editPriceBannerElement = fixture.debugElement.query(By.directive(EditPriceBannerComponent));
    });

    it('should display edit price banner', () => {
      expect(editPriceBannerElement).toBeTruthy();
    });

    it('should set banner properties to edit price banner', () => {
      const editBannerInstance: EditPriceBannerComponent = editPriceBannerElement.componentInstance;

      expect(editBannerInstance.bannerProperties).toEqual(SELLER_EDIT_PRICE_BANNER_PROPERTIES);
    });

    describe('when user clicks on banner', () => {
      beforeEach(() => {
        spyOn(component, 'clickedCTA');
        editPriceBannerElement.triggerEventHandler('clickedCTA', SELLER_EDIT_PRICE_BANNER_PROPERTIES.action);
      });

      it('should notify user clicked on banner', () => {
        expect(component.clickedCTA).toHaveBeenCalledTimes(1);
        expect(component.clickedCTA).toHaveBeenCalledWith(SELLER_EDIT_PRICE_BANNER_PROPERTIES.action);
      });
    });
  });
});
