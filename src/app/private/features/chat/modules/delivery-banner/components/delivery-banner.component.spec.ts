import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliveryBannerService } from '../services/delivery-banner/delivery-banner.service';

import { DeliveryBannerComponent } from './delivery-banner.component';

describe('DeliveryBannerComponent', () => {
  let component: DeliveryBannerComponent;
  let fixture: ComponentFixture<DeliveryBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryBannerComponent],
      providers: [DeliveryBannerService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
