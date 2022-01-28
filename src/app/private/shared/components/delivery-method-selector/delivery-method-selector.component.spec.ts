import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryMethodSelectorComponent } from './delivery-method-selector.component';

describe('DeliveryMethodSelectorComponent', () => {
  let component: DeliveryMethodSelectorComponent;
  let fixture: ComponentFixture<DeliveryMethodSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryMethodSelectorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryMethodSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
