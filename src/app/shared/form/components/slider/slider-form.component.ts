import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { CustomStepDefinition, Options } from '@angular-slider/ngx-slider';
import { SLIDER_VARIANT } from './enums/slider-variant.enum';
import { SliderFormStepConfig } from './interfaces/slider-form-step-config.interface';

@Component({
  selector: 'tsl-slider-form',
  templateUrl: './slider-form.component.html',
  styleUrls: ['./slider-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderFormComponent),
      multi: true,
    },
  ],
})
export class SliderFormComponent extends AbstractFormComponent<[number, number]> implements OnChanges {
  @Input() min: number = 0;
  @Input() max: number = 0;
  @Input() stepsConfig: SliderFormStepConfig[];
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

  constructor() {
    super();
    this.initOptions();
  }

  ngOnChanges(): void {
    this.init();
  }

  public writeValue(value: [number, number]): void {
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
      animate: false,
      showSelectionBar: true,
      floor: this.min,
      ceil: this.max,
      disabled: this.isDisabled,
      translate: (value: number): string => {
        if (value === this.max && this.limitless) {
          return $localize`:@@Limitless:No limit`;
        }
        return value + (this.units ? this.units : '');
      },
      hideLimitLabels: !this.limitTooltip,
      hidePointerLabels: !this.valueTooltip,
    };
  }

  private bindChangesListener(): void {
    this.form.controls.control.valueChanges.subscribe((value: [number, number]) => {
      this.value = value;
      this.onChange(this.value);
    });
  }

  private setStepsConfig(): void {
    if (this.stepsConfig?.length) {
      const stepsArray: CustomStepDefinition[] = [];
      try {
        this.stepsConfig.forEach((stepConfig: SliderFormStepConfig) => {
          for (let i = stepConfig.range[0]; i <= stepConfig.range[1]; i = i + stepConfig.step) {
            stepsArray.push({ value: i });
          }
        });

        this.options.stepsArray = stepsArray;
      } catch (e: any) {}
    }
  }
}
