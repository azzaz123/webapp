import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdsService } from '@core/ads/services';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { CHAT_AD_SLOTS } from '@private/features/chat/core/ads/chat-ad.config';
import { AdSlotShoppingComponent } from './ad-slot-shopping.component';

describe('AdSlotShoppingComponent', () => {
  const FIRST_AD_SLOT = CHAT_AD_SLOTS;
  let component: AdSlotShoppingComponent;
  let fixture: ComponentFixture<AdSlotShoppingComponent>;

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
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
