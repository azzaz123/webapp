import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycInfoSliderComponent } from './kyc-info-slider.component';

describe('KycInfoSliderComponent', () => {
  let component: KycInfoSliderComponent;
  let fixture: ComponentFixture<KycInfoSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KycInfoSliderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycInfoSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
