import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { CookieService } from 'ngx-cookie';
import { FiltersModule } from '../../filters.module';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { FilterHostDirective } from './directives/filter-host.directive';
import { FilterGroupComponent } from './filter-group.component';
import { FilterFactoryService } from './services/filter-factory.service';

@Component({
  selector: 'tsl-filters',
  template: `
    <h1>Bubble</h1>
    <tsl-filter-group [variant]="${FILTER_VARIANT.BUBBLE}" [config]="config"> </tsl-filter-group>
    <h1>Content</h1>
    <div style="border: 1px dashed black; background-color: white">
      <tsl-filter-group [variant]="${FILTER_VARIANT.CONTENT}" [config]="config"> </tsl-filter-group>
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

const CONFIG = [
  {
    id: 'range',
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
  variant: FILTER_VARIANT.BUBBLE,
  config: CONFIG,
};
