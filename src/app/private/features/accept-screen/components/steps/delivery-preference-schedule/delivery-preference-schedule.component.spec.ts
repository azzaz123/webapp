import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPreferenceScheduleComponent } from './delivery-preference-schedule.component';

describe('DeliveryPreferenceScheduleComponent', () => {
  let component: DeliveryPreferenceScheduleComponent;
  let fixture: ComponentFixture<DeliveryPreferenceScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryPreferenceScheduleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryPreferenceScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
