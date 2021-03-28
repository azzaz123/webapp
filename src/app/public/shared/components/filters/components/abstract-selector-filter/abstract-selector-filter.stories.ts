import { AbstractSelectorFilter } from '@public/shared/components/filters/components/abstract-selector-filter/abstract-selector-filter';
import { Component } from '@angular/core';
import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { AbstractSelectorFilterModule } from './abstract-selector-filter.module';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { CookieService } from 'ngx-cookie';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { SelectorFilterConfig } from '@public/shared/components/filters/components/abstract-selector-filter/interfaces/selector-filter-config.interface';
import { LoremIpsumComponent } from '@stories/components/lorem-ipsum/lorem-ipsum.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'story-abstract-selector-filter',
  template: `
    <tsl-filter-template
      [isBubble]="isBubble()"
      [isDropdown]="isDropdown()"
      [isClearable]="true"
      [title]="config.title"
      [icon]="config.icon"
      [label]="label"
      [hasValue]="hasValue$() | async"
      (clear)="handleClear()"
      (openStateChange)="openStateChange.emit($event)"
    >
      <tsl-selector-filter-template
        [hasContentPlaceholder]="hasContentPlaceholder()"
        [placeholderLabel]="drawerPlaceholder"
        [contentTitle]="contentTitle"
      >
        <div class="p-4">
          <stories-lorem-ipsum></stories-lorem-ipsum>
          <stories-lorem-ipsum></stories-lorem-ipsum>
        </div>
      </tsl-selector-filter-template>
    </tsl-filter-template>
  `,
})
class StoryAbstractSelectorFilterComponent extends AbstractSelectorFilter {}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/AbstractSelectorFilter',
  decorators: [
    moduleMetadata({
      imports: [AbstractSelectorFilterModule, AbstractFilterModule, SvgIconModule, HttpClientModule, CommonModule],
      declarations: [StoryAbstractSelectorFilterComponent, LoremIpsumComponent],
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

const Template: Story<StoryAbstractSelectorFilterComponent> = (args) => ({
  props: args,
  component: StoryAbstractSelectorFilterComponent,
  template: `
    <h1>Bubble variant</h1>
    <story-abstract-selector-filter [variant]="${FILTER_VARIANT.BUBBLE}" [config]="config">
    </story-abstract-selector-filter>
    <h1>Content variant</h1>
    <div style="border: 1px dashed black; background-color: white; position: relative;">
      <story-abstract-selector-filter [variant]="${FILTER_VARIANT.CONTENT}" [config]="config">
      </story-abstract-selector-filter>
      <story-abstract-selector-filter [variant]="${FILTER_VARIANT.CONTENT}" [config]="config">
      </story-abstract-selector-filter>
    </div>
  `,
});

const defaultConfig: SelectorFilterConfig = {
  id: COMMON_CONFIGURATION_ID.OBJECT_TYPE,
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
