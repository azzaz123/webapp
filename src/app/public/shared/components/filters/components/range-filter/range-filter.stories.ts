import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SliderFormModule } from '@shared/form/components/slider/slider-form.module';
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { RangeFilterComponent } from './range-filter.component';

export default {
  title: 'Webapp/Public/Shared/Components/Filters/RangeFilterComponent',
  decorators: [
    moduleMetadata({
      declarations: [RangeFilterComponent],
      imports: [CommonModule, SliderFormModule, ReactiveFormsModule],
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
  },
  range: [0, 1000],
};

export const Limitless = Template.bind({});
Limitless.args = {
  config: {
    mapKey: {
      maxKey: 'max',
      minKey: 'min',
    },
  },
  range: [0, 1000],
  limitless: true,
};

export const Steps = Template.bind({});
Steps.args = {
  config: {
    mapKey: {
      maxKey: 'max',
      minKey: 'min',
    },
  },
  range: [0, 5000],
  limitless: true,
  stepsConfig: [
    { range: [0, 10], step: 1 },
    { range: [10, 100], step: 10 },
    { range: [100, 1000], step: 100 },
    { range: [1000, 5000], step: 1000 },
    { range: [5000, 10000], step: 5000 },
  ],
};
