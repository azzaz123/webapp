import { SliderFormModule } from '@shared/form/components/slider/slider-form.module';
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
        template: `<div style="width:200px">${story.template}</div>`,
      };
    },
  ],
} as Meta;

const Template: Story<RangeFilterComponent> = (args: RangeFilterComponent) => ({
  component: RangeFilterComponent,
  props: args,
  moduleMetadata: {
    declarations: [RangeFilterComponent],
    imports: [SliderFormModule],
  },
  template: '<tsl-range-filter></tsl-range-filter>',
});

export const Default = Template.bind({});
