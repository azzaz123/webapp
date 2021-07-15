import { CustomStepDefinition, NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SLIDER_VARIANT } from './enums/slider-variant.enum';
import { SliderFormComponent } from './slider-form.component';

describe('SliderFormComponent', () => {
  let component: SliderFormComponent;
  let fixture: ComponentFixture<SliderFormComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const DEFAULT_MIN = 0;
  const DEFAULT_MAX = 10000;

  const limitLabelSelector = '.ngx-slider-limit';
  const valueLabelSelector = '.ngx-slider-model-value';
  const sliderElementSelector = 'ngx-slider';
  const hiddenVisibilityValue = 'hidden';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, NgxSliderModule, ReactiveFormsModule],
      declarations: [SliderFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SliderFormComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('when no special configuration is passed', () => {
    beforeEach(() => {
      component.min = DEFAULT_MIN;
      component.max = DEFAULT_MAX;
      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('should show limit label with min and max', () => {
      const minLabel = el.querySelectorAll(limitLabelSelector)[0];
      const maxLabel = el.querySelectorAll(limitLabelSelector)[1];

      expect(minLabel.innerHTML).toEqual(DEFAULT_MIN.toString());
      expect(maxLabel.innerHTML).toEqual(DEFAULT_MAX.toString());
    });

    it('should show value label with min value', () => {
      const valueLabel = el.querySelector(valueLabelSelector);

      expect(valueLabel.innerHTML).toEqual(DEFAULT_MIN.toString());
    });
  });

  describe('when hide labels configuration is passed', () => {
    beforeEach(() => {
      component.min = DEFAULT_MIN;
      component.max = DEFAULT_MAX;
      component.limitTooltip = false;
      component.valueTooltip = false;

      component.ngOnChanges();

      fixture.detectChanges();
    });

    it('should hide limit labels', () => {
      const limitLabel = el.querySelector(limitLabelSelector);

      expect((limitLabel as HTMLElement).style.visibility).toEqual(hiddenVisibilityValue);
    });

    it('should hide value label', () => {
      const valueLabel = el.querySelector(valueLabelSelector);

      expect((valueLabel as HTMLElement).style.visibility).toEqual(hiddenVisibilityValue);
    });
  });

  describe('when the slider has a tooltip', () => {
    it('should increase the margin of the content to include the tooltip', () => {
      component.valueTooltip = true;

      fixture.detectChanges();
      const sliderElement: HTMLElement = fixture.debugElement.query(By.css(sliderElementSelector)).nativeElement;

      expect(sliderElement.classList).toContain('Slider--with-tooltip');
    });
  });

  describe('when limitless configuration is passed', () => {
    beforeEach(() => {
      component.min = DEFAULT_MIN;
      component.max = DEFAULT_MAX;
      component.limitless = true;

      component.ngOnChanges();

      fixture.detectChanges();
    });

    it('should show max limit label with special content', () => {
      const maxLabel = el.querySelectorAll(limitLabelSelector)[1];

      expect(maxLabel.innerHTML).toEqual($localize`:@@Limitless:No limit`);
    });
  });

  describe('when units configuration is passed', () => {
    beforeEach(() => {
      component.min = DEFAULT_MIN;
      component.max = DEFAULT_MAX;
      component.units = 'units';

      component.ngOnChanges();

      fixture.detectChanges();
    });

    it('should show all labels with units appended', () => {
      const minLabel = el.querySelectorAll(limitLabelSelector)[0];
      const maxLabel = el.querySelectorAll(limitLabelSelector)[1];
      const valueLabel = el.querySelector(valueLabelSelector);

      const checkLabel = (label: Element) => {
        expect(label.innerHTML.substr(label.innerHTML.length - component.units.length)).toContain(component.units);
      };
      checkLabel(minLabel);
      checkLabel(maxLabel);
      checkLabel(valueLabel);
    });
  });

  describe('when stepsConfig configuration is passed', () => {
    beforeEach(() => {
      component.min = DEFAULT_MIN;
      component.max = DEFAULT_MAX;
      component.stepsConfig = [
        { range: [0, 40], step: 10 },
        { range: [50, 100], step: 50 },
      ];

      component.ngOnChanges();

      fixture.detectChanges();
    });

    it('should have created correct parsed steps config', () => {
      const stepsArray: CustomStepDefinition[] = [
        { value: 0 },
        { value: 10 },
        { value: 20 },
        { value: 30 },
        { value: 40 },
        { value: 50 },
        { value: 100 },
      ];

      expect(component.options.stepsArray).toEqual(stepsArray);
    });
  });

  describe('when disabled state changes', () => {
    it('should set the input disabled', () => {
      component.setDisabledState(true);

      expect(component.options.disabled).toBeTruthy();
    });

    it('should set the input NOT disabled', () => {
      component.setDisabledState(false);

      expect(component.options.disabled).toBeFalsy();
    });
  });

  describe('when value changes', () => {
    describe('and is range', () => {
      const value: [number, number] | number = [0, 10];

      beforeEach(() => {
        component.writeValue(value);
      });

      it('should call the input disabled', () => {
        expect(component.value).toEqual(value);
      });

      it('should set the correct variant', () => {
        expect(component.variant).toEqual(SLIDER_VARIANT.RANGE);
      });

      it('should set the correct value to the form', () => {
        expect(component.form.controls.control.value).toEqual(component.value);
      });
    });

    describe('and is single', () => {
      const value: [number, number] | number = 22;

      beforeEach(() => {
        component.writeValue(value);
      });

      it('should call the input disabled', () => {
        expect(component.value).toEqual(value);
      });

      it('should set the correct variant', () => {
        expect(component.variant).toEqual(SLIDER_VARIANT.SINGLE);
      });

      it('should set the correct value to the form', () => {
        expect(component.form.controls.control.value).toEqual(component.value);
      });
    });
  });
});
