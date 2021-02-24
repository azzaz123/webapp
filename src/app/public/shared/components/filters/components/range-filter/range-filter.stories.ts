import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { SliderFormModule } from '@shared/form/components/slider/slider-form.module';
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { CookieService } from 'ngx-cookie';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { RangeFilterConfig } from './interfaces/range-filter-config.interface';
import { RangeFilterComponent } from './range-filter.component';

@Component({
  selector: 'tsl-filters',
  template: `
    <div>
      <h1>Bubble variant</h1>
      <tsl-range-filter [variant]="${FILTER_VARIANT.BUBBLE}" [value]="value" [config]="config" (change)="changeBubble($event)">
      </tsl-range-filter>
      <h1>Content variant</h1>
      <div style="border: 1px dashed black; background-color: white">
        <tsl-range-filter [variant]="${FILTER_VARIANT.CONTENT}" [value]="value" [config]="config" (change)="changeContent($event)">
        </tsl-range-filter>
      </div>
    </div>
  `,
})
class FiltersComponent {
  public value: FilterParameter[];
  public config: RangeFilterConfig;

  changeBubble(value: FilterParameter[]): void {
    this.value = value;
  }

  changeContent(value: FilterParameter[]): void {
    this.value = value;
  }
}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/RangeFilterComponent',
  decorators: [
    moduleMetadata({
      declarations: [RangeFilterComponent],
      imports: [CommonModule, AbstractFilterModule, SliderFormModule, ReactiveFormsModule, HttpClientModule],
      providers: [{ provide: CookieService, useValue: MockCookieService }],
    }),
  ],
} as Meta;

const Template: Story<FiltersComponent> = (args: FiltersComponent) => ({
  component: FiltersComponent,
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
    icon: '/assets/icons/joke.svg',
    range: [10, 200],
    bubblePlaceholder: 'Price',
    units: '€',
  },
};

export const Limitless = Template.bind({});
Limitless.args = {
  config: {
    ...Default.args.config,
    limitless: true,
  },
};

export const Steps = Template.bind({});
Steps.args = {
  config: {
    ...Default.args.config,
    stepsConfig: [
      { range: [0, 10], step: 1 },
      { range: [10, 100], step: 10 },
      { range: [100, 1000], step: 100 },
      { range: [1000, 5000], step: 1000 },
      { range: [5000, 10000], step: 5000 },
    ],
  },
};

export const StepsAndLimitless = Template.bind({});
StepsAndLimitless.args = {
  config: {
    ...Default.args.config,
    limitless: true,
    stepsConfig: [
      { range: [0, 10], step: 1 },
      { range: [10, 100], step: 10 },
      { range: [100, 1000], step: 100 },
      { range: [1000, 5000], step: 1000 },
      { range: [5000, 10000], step: 5000 },
    ],
  },
};

export const WithValue = Template.bind({});
WithValue.args = {
  config: {
    ...StepsAndLimitless.args.config,
  },
  value: [
    {
      key: 'min',
      value: 8,
    },
    {
      key: 'max',
      value: 800,
    },
  ],
};