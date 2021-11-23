import { AbstractSelectFilter } from '@public/shared/components/filters/components/abstract-select-filter/abstract-select-filter';
import { Component } from '@angular/core';
import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { AbstractSelectFilterModule } from './abstract-select-filter.module';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { CookieService } from 'ngx-cookie';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { LoremIpsumComponent } from '@stories/components/lorem-ipsum/lorem-ipsum.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { SelectFilterParams } from '../select-filter/interfaces/select-filter-params.interface';
import { AbstractSelectFilterConfig } from './interfaces/abstract-select-filter-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'story-abstract-select-filter',
  template: `
    <tsl-filter-template
      [isBubble]="variant | isBubble"
      [isDropdown]="true"
      [isClearable]="true"
      [title]="config.title"
      [icon]="config.icon"
      [label]="label"
      [hasValue]="hasValue$ | async"
      (clear)="handleClear()"
      (openStateChange)="openStateChange.emit($event)"
    >
      <tsl-drawer-placeholder-template
        [hasContentPlaceholder]="!(variant | isBubble) && config.hasContentPlaceholder"
        [placeholderLabel]="drawerPlaceholder"
        [contentTitle]="contentTitle"
      >
        <div class="p-4">
          <stories-lorem-ipsum></stories-lorem-ipsum>
          <stories-lorem-ipsum></stories-lorem-ipsum>
        </div>
      </tsl-drawer-placeholder-template>
    </tsl-filter-template>
  `,
})
class StoryAbstractSelectFilterComponent extends AbstractSelectFilter<SelectFilterParams> {
  onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void {}
}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/AbstractSelectFilter',
  decorators: [
    moduleMetadata({
      imports: [AbstractSelectFilterModule, AbstractFilterModule, SvgIconModule, HttpClientModule, CommonModule],
      declarations: [StoryAbstractSelectFilterComponent, LoremIpsumComponent],
      providers: [
        { provide: CookieService, useValue: MockCookieService },
        { provide: FilterOptionService, useValue: {} },
      ],
    }),
  ],
  argTypes: {
    placeholderOpenChange: { action: 'Placeholder open change' },
  },
};

const Template: Story<StoryAbstractSelectFilterComponent> = (args) => ({
  props: args,
  component: StoryAbstractSelectFilterComponent,
  template: `
    <h1>Bubble variant</h1>
    <story-abstract-select-filter [variant]="${FILTER_VARIANT.BUBBLE}" [config]="config">
    </story-abstract-select-filter>
    <h1>Content variant</h1>
    <div style="border: 1px dashed black; background-color: white; position: relative;" class="p-3">
      <story-abstract-select-filter [variant]="${FILTER_VARIANT.CONTENT}" [config]="config">
      </story-abstract-select-filter>
      <div style="height: 1px; width: 100%; background-color: #90A4AE;" class="my-3"></div>
      <story-abstract-select-filter [variant]="${FILTER_VARIANT.CONTENT}" [config]="config">
      </story-abstract-select-filter>
    </div>
  `,
});

const defaultConfig: AbstractSelectFilterConfig<Record<string, FILTER_QUERY_PARAM_KEY>> = {
  id: COMMON_CONFIGURATION_ID.CATEGORIES,
  type: null,
  mapKey: {},
  title: 'Condition',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'Such a nice bubble',
  drawerPlaceholder: 'I am the father of everything!',
  hasContentPlaceholder: false,
};

export const WithoutContentPlaceholder = Template.bind({});
WithoutContentPlaceholder.args = {
  config: defaultConfig,
};

export const WithContentPlaceholder = Template.bind({});
WithContentPlaceholder.args = {
  config: {
    ...defaultConfig,
    hasContentPlaceholder: true,
  },
};
