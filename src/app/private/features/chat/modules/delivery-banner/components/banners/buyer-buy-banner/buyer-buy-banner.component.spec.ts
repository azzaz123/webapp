import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerBuyBannerComponent } from './buyer-buy-banner.component';

describe('BuyerBuyBannerComponent', () => {
  let component: BuyerBuyBannerComponent;
  let fixture: ComponentFixture<BuyerBuyBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerBuyBannerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerBuyBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
