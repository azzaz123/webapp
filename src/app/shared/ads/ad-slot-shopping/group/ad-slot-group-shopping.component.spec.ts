import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AdsService } from '@core/ads/services';
import { MockAdShoppingPageOptions, MockAdSlotShopping, MockAdsService } from '@fixtures/ads.fixtures.spec';
import { AdSlotGroupShoppingComponent } from './ad-slot-group-shopping.component';

describe('AdSlotGroupShoppingComponent', () => {
  let component: AdSlotGroupShoppingComponent;
  let fixture: ComponentFixture<AdSlotGroupShoppingComponent>;
  let elementRef: any;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AdSlotGroupShoppingComponent],
        providers: [{ provide: AdsService, useValue: MockAdsService }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AdSlotGroupShoppingComponent);
    component = fixture.componentInstance;
    component.adSlotShoppingConfiguration = MockAdSlotShopping;
    component.adShoppingPageOptions = MockAdShoppingPageOptions;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set div element id', () => {
    elementRef = fixture.debugElement.query(By.css(`#${MockAdSlotShopping.container}`)).nativeElement;
  });

  describe('when the view init', () => {
    it('should display ad shopping', () => {
      spyOn(MockAdsService, 'displayAdShopping').and.callThrough();

      component.ngAfterViewInit();

      expect(MockAdsService.displayAdShopping).toHaveBeenCalledWith(MockAdShoppingPageOptions, [MockAdSlotShopping]);
    });
  });
});
