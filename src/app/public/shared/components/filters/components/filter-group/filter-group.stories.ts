import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { CookieService } from 'ngx-cookie';
import { FiltersModule } from '../../filters.module';
import { FilterConfig } from '../../interfaces/filter-config.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { FilterHostDirective } from './directives/filter-host.directive';
import { FilterGroupComponent } from './filter-group.component';
import { FilterFactoryService } from './services/filter-factory.service';

@Component({
  selector: 'tsl-filters',
  template: `
    <h1>Bubble</h1>
    <tsl-filter-group [variant]="${FILTER_VARIANT.BUBBLE}" [config]="config" [initialValues]="initialValues || []"> </tsl-filter-group>
    <h1>Content</h1>
    <div style="border: 1px dashed black; background-color: white">
      <tsl-filter-group [variant]="${FILTER_VARIANT.CONTENT}" [config]="config" [initialValues]="initialValues || []"> </tsl-filter-group>
    </div>
  `,
})
class FiltersComponent {}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/FilterGroup',
  decorators: [
    moduleMetadata({
      declarations: [FilterGroupComponent, FilterHostDirective],
      imports: [CommonModule, FiltersModule, HttpClientModule],
      providers: [{ provide: CookieService, useValue: MockCookieService }, FilterFactoryService],
    }),
  ],
} as Meta;

const Template: Story<FiltersComponent> = (args: FiltersComponent) => ({
  component: FiltersComponent,
  props: args,
});

const CONFIG: FilterConfig<unknown>[] = [
  {
    id: 'range',
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
    id: 'toggle',
    mapKey: {
      key: 'warranty',
    },
    title: 'Warranty',
    icon: '/assets/icons/joke.svg',
    bubblePlaceholder: 'Has warranty',
  },
];

export const Default = Template.bind({});
Default.args = {
  config: CONFIG,
};

export const WithDefaultValues = Template.bind({});
WithDefaultValues.args = {
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

export const WithInitialValues = Template.bind({});
WithInitialValues.args = {
  config: CONFIG,
  initialValues: [
    { key: 'warranty', value: 'true' },
    { key: 'max', value: '5000' },
    { key: 'min', value: '1000' },
  ],
};
