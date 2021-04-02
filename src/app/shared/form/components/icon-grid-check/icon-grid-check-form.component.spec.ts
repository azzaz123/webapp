import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconGridCheckFormComponent } from './icon-grid-check-form.component';

describe('IconGridCheckFormComponent', () => {
  let component: IconGridCheckFormComponent;
  let fixture: ComponentFixture<IconGridCheckFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IconGridCheckFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconGridCheckFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
