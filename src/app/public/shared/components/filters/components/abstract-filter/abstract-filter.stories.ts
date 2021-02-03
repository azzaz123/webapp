import { AbstractFilterComponent } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.component';
import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';

export default {
  title: 'Webapp/Public/Shared/Components/Filters/AbstractFilter',
  component: AbstractFilterComponent,
  decorators: [
    moduleMetadata({
      imports: [BubbleModule],
    }),
  ],
};

const Template: Story<AbstractFilterComponent> = (args) => ({
  props: args,
  component: AbstractFilterComponent,
  template: `
    <div>
      <h1>Dropdown variant</h1>
      <tsl-abstract-filter [variant]="${FILTER_VARIANT.DROPDOWN}"></tsl-abstract-filter>
      <h1>Content variant</h1>
      <tsl-abstract-filter [variant]="${FILTER_VARIANT.CONTENT}"></tsl-abstract-filter>
    </div>
  `,
});

export const Default = Template.bind({});
