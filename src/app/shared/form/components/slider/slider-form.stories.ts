import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { SliderFormModule } from './slider-form.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'tsl-story-slider',
  template: `
    <h4>NgModel: {{ slider }}</h4>
    <tsl-slider-form
      [(ngModel)]="slider"
      [min]="min"
      [max]="max"
      [units]="units"
      [stepsConfig]="stepsConfig"
      [valueTooltip]="valueTooltip"
      [limitTooltip]="limitTooltip"
      [limitless]="limitless"
    ></tsl-slider-form>
    <h4 class="mt-4">FormGroup: {{ formGroup.value.slider[0] }} - {{ formGroup.value.slider[1] }}</h4>
    <form [formGroup]="formGroup">
      <tsl-slider-form
        formControlName="slider"
        [min]="min"
        [max]="max"
        [units]="units"
        [stepsConfig]="stepsConfig"
        [valueTooltip]="valueTooltip"
        [limitTooltip]="limitTooltip"
        [limitless]="limitless"
      ></tsl-slider-form>
    </form>
  `,
})
class StorySliderFormComponent {
  @Input() min = 0;
  @Input() max = 5000;
  @Input() units: string;
  @Input() stepsConfig: { range: number[]; step: number }[] = [];
  @Input() valueTooltip = true;
  @Input() limitTooltip = true;
  @Input() limitless = false;

  formGroup = new FormGroup({
    slider: new FormControl([20, 200]),
  });

  slider = 80;
}

export default {
  title: 'Webapp/Shared/Form/Components/Slider',
  component: StorySliderFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [StorySliderFormComponent],
      imports: [SliderFormModule, ReactiveFormsModule, FormsModule],
    }),
  ],
};

const Template: Story<StorySliderFormComponent> = (args) => ({
  props: args,
  template: `
      <tsl-story-slider
        [min]="min"
        [max]="max"
        [stepsConfig]="stepsConfig"
        [units]="units"
        [valueTooltip]="valueTooltip"
        [limitTooltip]="limitTooltip"
        [limitless]="limitless"></tsl-story-slider>
    `,
});

export const Default = Template.bind({});
Default.args = {
  min: 0,
  max: 5000,
  valueTooltip: true,
  limitTooltip: true,
  limitless: false,
};

export const StepsConfig = Template.bind({});
StepsConfig.args = {
  ...Default.args,
  stepsConfig: [
    { range: [0, 10], step: 1 },
    { range: [10, 100], step: 10 },
    { range: [100, 1000], step: 100 },
    { range: [1000, 5000], step: 1000 },
    { range: [5000, 10000], step: 5000 },
  ],
};

export const Units = Template.bind({});
Units.args = {
  ...StepsConfig.args,
  units: 'km',
};

export const WithoutValueTooltip = Template.bind({});
WithoutValueTooltip.args = {
  ...Default.args,
  valueTooltip: false,
};

export const WithoutLimitTooltip = Template.bind({});
WithoutLimitTooltip.args = {
  ...Default.args,
  limitTooltip: false,
};

export const Limitless = Template.bind({});
Limitless.args = {
  ...Default.args,
  limitless: true,
};
