import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AdsService } from '@core/ads/services';
import { MockAdShoppingPageOptions, MockAdSlotShopping, MockAdsService } from '@fixtures/ads.fixtures.spec';
import { AdSlotShoppingComponent } from './ad-slot-shopping.component';

describe('AdSlotShoppingComponent', () => {
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
    component.adSlotContainer = 'div-gpt-ad-1536058445169-';
    component.adShoppingPageOptions = MockAdShoppingPageOptions;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
  /*
  it('should set div element id', () => {
    elementRef = fixture.debugElement.query(By.css(`#${MockAdSlotShopping.container}`)).nativeElement;
  });

  describe('when the view init', () => {
    it('should display ad shopping', () => {
      spyOn(MockAdsService, 'displayAdShopping').and.callThrough();

      component.ngAfterViewInit();

      expect(MockAdsService.displayAdShopping).toHaveBeenCalledWith(MockAdShoppingPageOptions, MockAdSlotShopping);
    });
  });
  */
});
