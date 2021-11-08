import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SliderFormModule } from '@shared/form/components/slider/slider-form.module';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { RangeFilterComponent } from './range-filter.component';
import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { IsBubblePipe } from '@public/shared/components/filters/components/abstract-filter/pipes/is-bubble.pipe';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

describe('RangeFilterComponent', () => {
  let component: RangeFilterComponent;
  let fixture: ComponentFixture<RangeFilterComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RangeFilterComponent, IsBubblePipe],
      imports: [CommonModule, SliderFormModule, ReactiveFormsModule, AbstractFilterModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeFilterComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;

    component.config = {
      type: FILTER_TYPES.RANGE,
      mapKey: {
        maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
        minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      },
      title: 'How much do you want to pay?',
      icon: '/assets/icons/joke.svg',
      id: COMMON_CONFIGURATION_ID.CATEGORIES,
      bubblePlaceholder: 'placeholder',
      range: [0, 500],
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when component inits', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should set the label with placeholder value', () => {
      expect(component.label).toEqual(component.config.bubblePlaceholder);
    });

    it('should create the correct form', () => {
      expect(component.formGroup.controls.range).toBeTruthy();
      expect(component.formGroup.controls.min).toBeTruthy();
      expect(component.formGroup.controls.max).toBeTruthy();
    });

    it('should set correct values to initial form if it has no value', () => {
      expect(component.formGroup.controls.range.value).toEqual([component.range[0], component.range[1]]);
      expect(component.formGroup.controls.min.value).toEqual(component.range[0]);
      expect(component.formGroup.controls.max.value).toEqual(component.range[1]);
    });

    describe('when stepsConfig is present', () => {
      it('should set the range values correctly', () => {
        component.config.stepsConfig = [
          {
            range: [0, 100],
            step: 5,
          },
          {
            range: [100, 200],
            step: 10,
          },
        ];

        fixture.detectChanges();
        component.ngOnInit();

        expect(component.range[0]).toEqual(component.config.stepsConfig[0].range[0]);
        expect(component.range[1]).toEqual(component.config.stepsConfig[component.config.stepsConfig.length - 1].range[1]);
      });
    });

    describe('when has value ', () => {
      let min;
      let max;

      describe('both min and max ', () => {
        beforeEach(() => {
          component.value = [
            {
              key: component.config.mapKey.minKey,
              value: '10',
            },
            {
              key: component.config.mapKey.maxKey,
              value: '100',
            },
          ];

          fixture.detectChanges();

          min = component.value.find((parameter: FilterParameter) => parameter.key === component.config.mapKey.minKey).value;
          max = component.value.find((parameter: FilterParameter) => parameter.key === component.config.mapKey.maxKey).value;
        });
        it('should set correct values to initial form ', () => {
          expect(component.formGroup.controls.range.value).toEqual([min, max]);
          expect(component.formGroup.controls.min.value).toEqual(min);
          expect(component.formGroup.controls.max.value).toEqual(max);
        });

        it('should set correct values to label ', () => {
          expect(component.label).toEqual(`${min} - ${max}`);
        });
      });

      describe('only min', () => {
        beforeEach(() => {
          component.value = [
            {
              key: component.config.mapKey.minKey,
              value: '10',
            },
          ];

          fixture.detectChanges();

          min = component.value.find((parameter: FilterParameter) => parameter.key === component.config.mapKey.minKey).value;
        });

        it('should set correct values to initial form ', () => {
          expect(component.formGroup.controls.range.value).toEqual([min, component.range[1]]);
          expect(component.formGroup.controls.min.value).toEqual(min);
          expect(component.formGroup.controls.max.value).toEqual(component.range[1]);
        });

        it('should set correct values to label ', () => {
          expect(component.label).toEqual(`${$localize`:@@From:From`} ${min}`);
        });
      });

      describe('only max', () => {
        beforeEach(() => {
          component.value = [
            {
              key: component.config.mapKey.maxKey,
              value: '100',
            },
          ];

          fixture.detectChanges();

          max = component.value.find((parameter: FilterParameter) => parameter.key === component.config.mapKey.maxKey).value;
        });

        it('should set correct values to initial form ', () => {
          expect(component.formGroup.controls.range.value).toEqual([component.range[0], max]);
          expect(component.formGroup.controls.min.value).toEqual(component.range[0]);
          expect(component.formGroup.controls.max.value).toEqual(max);
        });

        it('should set correct values to label ', () => {
          expect(component.label).toEqual(`${$localize`:@@To:To`} ${max}`);
        });
      });
    });
  });

  describe('when cleaning the value', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.handleClear();
    });

    it('should restart values', () => {
      expect(component.formGroup.controls.range.value).toEqual([component.config.range[0], component.config.range[1]]);
      expect(component.formGroup.controls.min.value).toEqual(component.config.range[0]);
      expect(component.formGroup.controls.max.value).toEqual(component.config.range[1]);
    });

    it('should restart label', () => {
      expect(component.label).toEqual(component.config.bubblePlaceholder);
    });

    it('should restart value', () => {
      expect(component.value).toEqual([]);
    });

    it('should emit value changes', () => {
      spyOn(component.valueChange, 'emit');

      component.handleClear();

      expect(component.valueChange.emit).toHaveBeenCalledWith([
        { key: FILTER_QUERY_PARAM_KEY.maxPrice, value: undefined },
        { key: FILTER_QUERY_PARAM_KEY.minPrice, value: undefined },
      ]);
    });
  });

  describe('when applying the value', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should emit change event', () => {
      spyOn(component.valueChange, 'emit');

      component.handleApply();

      expect(component.valueChange.emit).toHaveBeenCalledWith(component.value);
    });
  });
});
