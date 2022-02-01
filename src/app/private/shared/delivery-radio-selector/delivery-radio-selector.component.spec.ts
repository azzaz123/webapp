import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryRadioSelectorComponent } from './delivery-radio-selector.component';

describe('DeliveryRadioSelectorComponent', () => {
  let component: DeliveryRadioSelectorComponent;
  let fixture: ComponentFixture<DeliveryRadioSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryRadioSelectorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryRadioSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
