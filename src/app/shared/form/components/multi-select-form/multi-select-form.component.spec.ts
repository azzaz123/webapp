import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectFormComponent } from './multi-select-form.component';

describe('MultiSelectFormComponent', () => {
  let component: MultiSelectFormComponent;
  let fixture: ComponentFixture<MultiSelectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiSelectFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
