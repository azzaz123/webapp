import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentTrakingComponent } from './shipment-traking.component';

describe('ShipmentTrakingComponent', () => {
  let component: ShipmentTrakingComponent;
  let fixture: ComponentFixture<ShipmentTrakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShipmentTrakingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentTrakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
