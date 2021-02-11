import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { CustomStepDefinition, Options } from '@angular-slider/ngx-slider';
import { SLIDER_VARIANT } from './enums/slider-variant.enum';

@Component({
  selector: 'tsl-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
})
export class SliderComponent extends AbstractFormComponent implements OnInit, OnChanges {
  @Input() min: number;
  @Input() max: number;
  @Input() stepsConfig: { range: number[]; step: number }[];
  @Input() units: string;
  @Input() valueTooltip: boolean = true;
  @Input() limitTooltip: boolean = true;
  @Input() limitless: boolean = false;

  public readonly SLIDER_VARIANT = SLIDER_VARIANT;
  public variant = this.SLIDER_VARIANT.SINGLE;

  public options: Options;

  public form: FormGroup = new FormGroup({
    control: new FormControl(),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.init();
    }
  }

  public writeValue(value: any): void {
    this.value = value;
    this.variant = Array.isArray(this.value) ? SLIDER_VARIANT.RANGE : SLIDER_VARIANT.SINGLE;
    this.form.controls.control.setValue(value);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.options.disabled = isDisabled;
  }

  private init(): void {
    this.initOptions();
    this.setStepsConfig();
    this.bindChangesListener();
  }

  private initOptions(): void {
    this.options = {
      showSelectionBar: true,
      floor: this.min,
      ceil: this.max,
      disabled: this.isDisabled,
      translate: (value: number): string => {
        if (value === this.max && this.limitless) {
          return $localize`:@@limitless:No limit`;
        }
        return value + (this.units ? this.units : '');
      },
      hideLimitLabels: !this.limitTooltip,
      hidePointerLabels: !this.valueTooltip,
    };
  }

  private bindChangesListener(): void {
    this.form.controls.control.valueChanges.subscribe((value: any) => {
      this.value = this.form.controls.control.value;
      this.onChange(this.value);
    });
  }

  private setStepsConfig(): void {
    if (this.stepsConfig && this.stepsConfig.length) {
      const stepsArray: CustomStepDefinition[] = [];
      try {
        this.stepsConfig.forEach((stepConfig: { range: number[]; step: number }) => {
          for (let i = stepConfig.range[0]; i < stepConfig.range[1]; i = i + stepConfig.step) {
            stepsArray.push({ value: i });
          }
        });

        this.options.stepsArray = stepsArray;
      } catch (e: any) {}
    }
  }
}
