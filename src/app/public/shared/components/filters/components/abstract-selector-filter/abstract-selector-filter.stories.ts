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

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'story-abstract-selector-filter',
  template: `
    <tsl-filter-template
      [isBubble]="isBubble()"
      [isDropdown]="isDropdown()"
      [hasApply]="true"
      [isClearable]="true"
      [title]="config.title"
      [icon]="config.icon"
      [label]="label"
      [hasValue]="hasValue()"
      (apply)="handleApply()"
      (clear)="handleClear()"
      (openStateChange)="openStateChange.emit($event)"
    >
      <tsl-selector-filter-template [hasContentPlaceholder]="isContentWrapper()"></tsl-selector-filter-template>
    </tsl-filter-template>
  `,
})
class StoryAbstractSelectorFilterComponent extends AbstractSelectorFilter<Record<string, string>> {}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/AbstractSelectorFilter',
  decorators: [
    moduleMetadata({
      imports: [AbstractSelectorFilterModule, AbstractFilterModule],
      declarations: [StoryAbstractSelectorFilterComponent],
      providers: [{ provide: CookieService, useValue: MockCookieService }],
    }),
  ],
};

const Template: Story<StoryAbstractSelectorFilterComponent> = (args) => ({
  props: args,
  component: StoryAbstractSelectorFilterComponent,
  template: `
    <h1>Bubble variant</h1>
    <story-abstract-selector-filter [variant]="${FILTER_VARIANT.BUBBLE}" [config]="config">
    </story-abstract-selector-filter>
    <h1>Content variant</h1>
    <div style="border: 1px dashed black; background-color: white">
      <story-abstract-selector-filter [variant]="${FILTER_VARIANT.CONTENT}" [config]="config">
      </story-abstract-selector-filter>
    </div>
  `,
});

const defaultConfig: SelectorFilterConfig<Record<string, string>> = {
  id: '',
  type: null,
  mapKey: {},
  title: 'I can be any selector',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'Placeholder',
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
