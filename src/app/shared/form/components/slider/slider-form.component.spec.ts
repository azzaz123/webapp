import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
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
  const hiddenVisibilityValue = 'hidden';

  beforeEach(async () => {
    TestBed.configureTestingModule({
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
      // component.units = '';
      // component.stepsConfig = [];
      // component.limitTooltip = true;
      // component.valueTooltip = true;
      // component.limitless = false;

      component.ngOnChanges({
        min: new SimpleChange(null, component.min, true),
        max: new SimpleChange(null, component.max, true),
      });

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

      component.ngOnChanges({
        min: new SimpleChange(null, component.min, true),
        limitTooltip: new SimpleChange(null, component.limitTooltip, true),
        valueTooltip: new SimpleChange(null, component.valueTooltip, true),
      });

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

  describe('when limitless configuration is passed', () => {
    beforeEach(() => {
      component.min = DEFAULT_MIN;
      component.max = DEFAULT_MAX;
      component.limitless = true;

      component.ngOnChanges({
        min: new SimpleChange(null, component.min, true),
        max: new SimpleChange(null, component.max, true),
        limitless: new SimpleChange(null, component.limitless, true),
      });

      fixture.detectChanges();
    });

    it('shouldmax limit label with special content', () => {
      const maxLabel = el.querySelectorAll(limitLabelSelector)[1];

      expect(maxLabel.innerHTML).toEqual($localize`:@@Limitless:No limit`);
    });
  });

  describe('when units configuration is passed', () => {
    beforeEach(() => {
      component.min = DEFAULT_MIN;
      component.max = DEFAULT_MAX;
      component.units = 'units';

      component.ngOnChanges({
        min: new SimpleChange(null, component.min, true),
        max: new SimpleChange(null, component.max, true),
        units: new SimpleChange(null, component.units, true),
      });

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
});
