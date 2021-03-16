import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AdsService } from '@core/ads/services';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { CHAT_AD_SLOTS } from '@private/features/chat/core/ads/chat-ad.config';
import { AdSlotComponent } from './ad-slot.component';

describe('AdComponent', () => {
  const FIRST_AD_SLOT = CHAT_AD_SLOTS;
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
