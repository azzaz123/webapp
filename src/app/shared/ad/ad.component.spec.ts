import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CHAT_AD_SLOTS } from '@core/ads/constants';
import { AdsService } from '@core/ads/services';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { AdComponent } from './ad.component';

describe('AdComponent', () => {
  const FIRST_AD_SLOT = CHAT_AD_SLOTS[0];
  let component: AdComponent;
  let fixture: ComponentFixture<AdComponent>;
  let elementRef: any;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AdComponent],
        providers: [{ provide: AdsService, useValue: MockAdsService }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AdComponent);
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
