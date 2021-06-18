import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdSlotWrapperComponent } from './ad-slot-wrapper.component';

describe('AdSlotWrapperComponent', () => {
  let component: AdSlotWrapperComponent;
  let fixture: ComponentFixture<AdSlotWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdSlotWrapperComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdSlotWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
