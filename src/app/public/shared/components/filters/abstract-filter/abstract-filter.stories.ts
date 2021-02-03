import { AbstractFilterComponent } from '@public/shared/components/filters/abstract-filter/abstract-filter.component';
import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';

export default {
  title: 'Webapp/Public/Shared/Components/Filters/AbstractFilter',
  component: AbstractFilterComponent,
  decorators: [moduleMetadata({})],
};

const Template: Story<AbstractFilterComponent> = (args) => ({
  props: args,
  component: AbstractFilterComponent,
});

export const Default = Template.bind({});
