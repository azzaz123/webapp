import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SliderFormModule } from '@shared/form/components/slider/slider-form.module';
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { RangeFilterComponent } from './range-filter.component';

export default {
  title: 'Webapp/Public/Shared/Components/Filters/RangeFilterComponent',
  decorators: [
    moduleMetadata({
      declarations: [RangeFilterComponent],
      imports: [CommonModule, AbstractFilterModule, SliderFormModule, ReactiveFormsModule, HttpClientModule], // Por qué hace falta el HttpClientModule??
    }),
  ],
  argTypes: { change: { action: 'change' } },
} as Meta;

const Template: Story<RangeFilterComponent> = (args: RangeFilterComponent) => ({
  component: RangeFilterComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  config: {
    mapKey: {
      maxKey: 'max',
      minKey: 'min',
    },
    title: 'How much do you want to pay?',
  },
  range: [10, 200],
  placeholder: 'Price',
  units: '€',
};

export const Limitless = Template.bind({});
Limitless.args = {
  ...Default.args,
  limitless: true,
};

export const Steps = Template.bind({});
Steps.args = {
  ...Default.args,
  stepsConfig: [
    { range: [0, 10], step: 1 },
    { range: [10, 100], step: 10 },
    { range: [100, 1000], step: 100 },
    { range: [1000, 5000], step: 1000 },
    { range: [5000, 10000], step: 5000 },
  ],
};

export const StepsAndLimitless = Template.bind({});
StepsAndLimitless.args = {
  ...Default.args,
  limitless: true,
  stepsConfig: [
    { range: [0, 10], step: 1 },
    { range: [10, 100], step: 10 },
    { range: [100, 1000], step: 100 },
    { range: [1000, 5000], step: 1000 },
    { range: [5000, 10000], step: 5000 },
  ],
};

export const WithValue = Template.bind({});
WithValue.args = {
  ...Steps.args,
  value: {
    min: 20,
    max: 200,
  },
};
