import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AdSlotConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { MockAdSlots, MockAdsService } from '@fixtures/ads.fixtures.spec';
import { AdSlotComponent } from './ad-slot.component';

describe('AdSlotComponent', () => {
  const FIRST_AD_SLOT: AdSlotConfiguration = MockAdSlots[0];
  let component: AdSlotComponent;
  let fixture: ComponentFixture<AdSlotComponent>;
  let elementRef: any;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AdSlotComponent],
        providers: [{ provide: AdsService, useValue: MockAdsService }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AdSlotComponent);
    component = fixture.componentInstance;
    component.adSlot = FIRST_AD_SLOT;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set div element id', () => {
    elementRef = fixture.debugElement.query(By.css(`#${FIRST_AD_SLOT.id}`)).nativeElement;

    expect(elementRef).toBeTruthy();
  });
});
