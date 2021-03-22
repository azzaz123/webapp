import { AbstractSelectorFilter } from '@public/shared/components/filters/components/abstract-selector-filter/abstract-selector-filter';
import { Component } from '@angular/core';
import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { AbstractSelectorFilterModule } from './abstract-selector-filter.module';

@Component({
  template: ` <tsl-selector-filter-template></tsl-selector-filter-template> `,
})
class StoryAbstractSelectorFilterComponent extends AbstractSelectorFilter {}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/AbstractSelectorFilter',
  decorators: [
    moduleMetadata({
      imports: [AbstractSelectorFilterModule],
    }),
  ],
};

const Template: Story<StoryAbstractSelectorFilterComponent> = (args) => ({
  props: args,
  component: StoryAbstractSelectorFilterComponent,
});

export const Default = Template.bind({});
