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

  describe('when initialized', () => {
    it('should set label to configured placeholder', () => {});

    it('should get options from backend', () => {});
  });

  describe('when provided a value from the parent', () => {
    it('should set corresponding label', () => {});

    it('should have corresponding value', () => {});
  });

  describe('when value changes', () => {
    describe('from the parent', () => {
      it('should change label', () => {});

      it('should change value', () => {});

      it('should emit value change', () => {});
    });
    describe('from form component', () => {
      it('should change label', () => {});

      it('should change value', () => {});

      it('should emit value change', () => {});
    });
  });
});
