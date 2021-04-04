import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconGridFilterComponent } from './icon-grid-filter.component';

describe('IconGridFilterComponent', () => {
  let component: IconGridFilterComponent;
  let fixture: ComponentFixture<IconGridFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IconGridFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconGridFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
