import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorParentOptionComponent } from './selector-parent-option.component';

describe('SelectorParentOptionComponent', () => {
  let component: SelectorParentOptionComponent;
  let fixture: ComponentFixture<SelectorParentOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectorParentOptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorParentOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
