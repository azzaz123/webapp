import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyBannerComponent } from './buy-banner.component';

describe('BuyBannerComponent', () => {
  let component: BuyBannerComponent;
  let fixture: ComponentFixture<BuyBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyBannerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
