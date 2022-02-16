import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateShippingBannerComponent } from './activate-shipping-banner.component';

describe('ActivateShippingBannerComponent', () => {
  let component: ActivateShippingBannerComponent;
  let fixture: ComponentFixture<ActivateShippingBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivateShippingBannerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateShippingBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
