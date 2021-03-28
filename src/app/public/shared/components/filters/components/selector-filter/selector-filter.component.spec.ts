import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorFilterComponent } from './selector-filter.component';

describe('SelectorFilterComponent', () => {
  let component: SelectorFilterComponent;
  let fixture: ComponentFixture<SelectorFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectorFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
