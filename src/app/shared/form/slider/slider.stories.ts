import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SliderComponent } from './slider.component';

export default {
  title: 'Webapp/Shared/Form/Slider',
  component: SliderComponent,
  argTypes: {},
  decorators: [
    moduleMetadata({
      declarations: [SliderComponent],
      imports: [],
    }),
  ],
};

const Template: Story<SliderComponent> = (args) => ({
  props: args,
  template: `
      <tsl-slider></tsl-slider>
    `,
});

export const Default = Template.bind({});
