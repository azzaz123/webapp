import { CommonModule } from '@angular/common';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { RangeFilterComponent } from './range-filter.component';

export default {
  title: 'Webapp/Public/Shared/Components/Filters/RangeFilterComponent',
  component: RangeFilterComponent,
  decorators: [
    (storyFunc) => {
      const story = storyFunc();

      return {
        ...story,
        template: `<div style="width:120px">${story.template}</div>`,
      };
    },
  ],
} as Meta;

const Template: Story<RangeFilterComponent> = (args: RangeFilterComponent) => ({
  component: RangeFilterComponent,
  props: args,
  moduleMetadata: {
    declarations: [RangeFilterComponent],
    imports: [CommonModule],
  },
  template: '<tsl-range-filter></tsl-range-filter>',
});

export const Default = Template.bind({});
