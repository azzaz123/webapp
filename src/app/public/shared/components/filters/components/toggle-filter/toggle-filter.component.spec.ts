import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToggleFormModule } from '@shared/form/components/toggle/toggle-form.module';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { ToggleFilterComponent } from './toggle-filter.component';

describe('ToggleFilterComponent', () => {
  let component: ToggleFilterComponent;
  let fixture: ComponentFixture<ToggleFilterComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToggleFilterComponent],
      imports: [CommonModule, ToggleFormModule, FormsModule, AbstractFilterModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleFilterComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;

    component.config = {
      id: '',
      mapKey: {
        key: 'warranty',
      },
      title: 'Warranty',
      icon: '/assets/icons/joke.svg',
      bubblePlaceholder: 'Has warranty',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when is bubble', () => {
    const bubbleClick = () => {
      const filterSelector = 'tsl-bubble';
      fixture.debugElement.query(By.css(filterSelector)).nativeElement.click();
    };

    const clearClick = () => {
      const clearSelector = '.Bubble__clear';
      fixture.debugElement.query(By.css(clearSelector)).nativeElement.click();
    };

    beforeEach(() => {
      component.variant = FILTER_VARIANT.BUBBLE;
      fixture.detectChanges();
    });

    it('should toggle true value on click', () => {
      bubbleClick();

      expect(component.toggle).toBeTruthy();
    });

    it('should toggle false value on click', () => {
      component.toggle = true;

      bubbleClick();

      expect(component.toggle).toBeFalsy();
    });

    describe('and has value true', () => {
      beforeEach(() => {
        component.toggle = true;
        fixture.detectChanges();
      });

      it('should toggle false value on clear', () => {
        clearClick();

        expect(component.toggle).toBeFalsy();
      });
    });
  });

  describe('when is content', () => {
    const toggleClick = () => {
      const toggleSelector = 'tsl-toggle-form input';
      fixture.debugElement.query(By.css(toggleSelector)).nativeElement.click();
    };

    beforeEach(() => {
      component.variant = FILTER_VARIANT.CONTENT;
      fixture.detectChanges();
    });

    it('should toggle true value on click', () => {
      toggleClick();

      expect(component.toggle).toBeTruthy();
    });

    it('should toggle false value on click', () => {
      component.toggle = true;
      fixture.detectChanges();

      toggleClick();

      expect(component.toggle).toBeFalsy();
    });
  });
});
