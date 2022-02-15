import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskSellerForShippingBannerComponent } from './ask-seller-for-shipping-banner.component';

describe('AskSellerForShippingBannerComponent', () => {
  let component: AskSellerForShippingBannerComponent;
  let fixture: ComponentFixture<AskSellerForShippingBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AskSellerForShippingBannerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskSellerForShippingBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
