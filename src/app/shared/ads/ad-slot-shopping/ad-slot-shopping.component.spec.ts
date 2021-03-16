import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AdsService } from '@core/ads/services';
import { MockAdShoppingPageOptions, MockAdSlotShopping, MockAdsService } from '@fixtures/ads.fixtures.spec';
import { CHAT_AD_SLOTS } from '@private/features/chat/core/ads/chat-ad.config';
import { AdSlotShoppingComponent } from './ad-slot-shopping.component';

describe('AdSlotShoppingComponent', () => {
  const FIRST_AD_SLOT = CHAT_AD_SLOTS;
  let component: AdSlotShoppingComponent;
  let fixture: ComponentFixture<AdSlotShoppingComponent>;
  let elementRef: any;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AdSlotShoppingComponent],
        providers: [{ provide: AdsService, useValue: MockAdsService }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AdSlotShoppingComponent);
    component = fixture.componentInstance;
    component.adSlotShopping = MockAdSlotShopping;
    component.adShoppingPageOptions = MockAdShoppingPageOptions;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set div element id', () => {
    elementRef = fixture.debugElement.query(By.css(`#${MockAdSlotShopping.slotId}`)).nativeElement;
  });

  describe('when the view init', () => {
    it('should display ad shopping', () => {
      spyOn(MockAdsService, 'displayAdShopping').and.callThrough();

      component.ngAfterViewInit();

      expect(MockAdsService.displayAdShopping).toHaveBeenCalledWith(MockAdShoppingPageOptions, MockAdSlotShopping);
    });
  });
});
