import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { CookieService } from 'ngx-cookie';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { FiltersModule } from '../../filters.module';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { RangeFilterConfig } from '../range-filter/interfaces/range-filter-config.interface';
import { ToggleFilterConfig } from '../toggle-filter/interfaces/toggle-filter-config.interface';
import { FilterHostDirective } from './directives/filter-host.directive';
import { FilterGroupComponent } from './filter-group.component';
import { FilterFactoryService } from './services/filter-factory.service';

@Component({
  selector: 'tsl-filters',
  template: `
    <tsl-filter-group [variant]="variant" [config]="config" [values]="values || []" (valueChange)="valueChange($event)"> </tsl-filter-group>
  `,
})
class FiltersComponent {
  public variant: FILTER_VARIANT;
  public config: [RangeFilterConfig, ToggleFilterConfig];
  public values: FilterParameter[];

  public valueChange(): void {}
}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/FilterGroup',
  decorators: [
    moduleMetadata({
      declarations: [FilterGroupComponent, FilterHostDirective],
      imports: [CommonModule, FiltersModule, HttpClientModule],
      providers: [{ provide: CookieService, useValue: MockCookieService }, FilterFactoryService],
    }),
  ],
  argTypes: { valueChange: { action: 'valueChange' } },
} as Meta;

const Template: Story<FiltersComponent> = (args: FiltersComponent) => ({
  component: FiltersComponent,
  props: args,
});

const CONFIG: [RangeFilterConfig, ToggleFilterConfig] = [
  {
    id: 'storybook_price',
    type: FILTER_TYPES.RANGE,
    mapKey: {
      maxKey: 'max',
      minKey: 'min',
    },
    title: 'How much do you want to pay?',
    icon: '/assets/icons/joke.svg',
    range: [10, 10000],
    bubblePlaceholder: 'Price',
    units: '€',
  },
  {
    id: 'storybook_warranty',
    type: FILTER_TYPES.TOGGLE,
    mapKey: {
      key: 'warranty',
    },
    title: 'Warranty',
    icon: '/assets/icons/joke.svg',
    bubblePlaceholder: 'Has warranty',
  },
];

export const Bubble_Default = Template.bind({});
Bubble_Default.args = {
  variant: FILTER_VARIANT.BUBBLE,
  config: CONFIG,
};

export const Bubble_WithDefaultValues = Template.bind({});
Bubble_WithDefaultValues.args = {
  variant: FILTER_VARIANT.BUBBLE,
  config: [
    {
      ...CONFIG[0],
      defaultValue: [
        { key: 'max', value: '2000' },
        { key: 'min', value: '20' },
      ],
    },
    {
      ...CONFIG[1],
      defaultValue: [{ key: 'warranty', value: 'true' }],
    },
  ],
};

export const Bubble_WithInitialValues = Template.bind({});
Bubble_WithInitialValues.args = {
  variant: FILTER_VARIANT.BUBBLE,
  config: CONFIG,
  values: [
    { key: 'warranty', value: 'true' },
    { key: 'max', value: '5000' },
    { key: 'min', value: '1000' },
  ],
};

export const Content_Default = Template.bind({});
Content_Default.args = {
  ...Bubble_Default.args,
  variant: FILTER_VARIANT.CONTENT,
};

export const Content_WithDefaultValues = Template.bind({});
Content_WithDefaultValues.args = {
  ...Bubble_WithDefaultValues.args,
  variant: FILTER_VARIANT.CONTENT,
};

export const Content_WithInitialValues = Template.bind({});
Content_WithInitialValues.args = {
  ...Bubble_WithInitialValues.args,
  variant: FILTER_VARIANT.CONTENT,
};