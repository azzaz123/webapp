import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_BUY_DELIVERY_BANNER_PROPERTIES } from '@fixtures/chat/delivery-banner/delivery-banner.fixtures.spec';
import { DELIVERY_BANNER_ACTION } from '../enums/delivery-banner-action.enum';
import { DeliveryBanner } from '../interfaces/delivery-banner.interface';
import { BuyBannerComponent } from './banners/buy-banner/buy-banner.component';

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
      declarations: [TestWrapperDeliveryBannerComponent, DeliveryBannerComponent, BuyBannerComponent],
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
    beforeEach(() => {
      component.bannerProperties = MOCK_BUY_DELIVERY_BANNER_PROPERTIES;
      fixture.detectChanges();
    });

    it('should display buy banner', () => {
      const buyBannerElement: DebugElement = fixture.debugElement.query(By.directive(BuyBannerComponent));

      expect(buyBannerElement).toBeTruthy();
    });

    it('should set banner properties to buy banner', () => {
      const buyBannerElement: DebugElement = fixture.debugElement.query(By.directive(BuyBannerComponent));
      const buyBannerInstance: BuyBannerComponent = buyBannerElement.componentInstance;

      expect(buyBannerInstance.bannerProperties).toEqual(MOCK_BUY_DELIVERY_BANNER_PROPERTIES);
    });
  });
});
