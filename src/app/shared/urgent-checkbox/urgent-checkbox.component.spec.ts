import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgentCheckboxComponent } from './urgent-checkbox.component';

describe('UrgentCheckboxComponent', () => {
  let component: UrgentCheckboxComponent;
  let fixture: ComponentFixture<UrgentCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrgentCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgentCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
