import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { InfoBubbleComponent } from './info-bubble.component';

export default {
  title: 'Webapp/Public/Features/Search/Components/InfoBubble',
  component: InfoBubbleComponent,
  decorators: [styledWrapperDecorator('max-width: 220px;')],
} as Meta;

const Template: Story<InfoBubbleComponent> = (args: InfoBubbleComponent) => ({
  component: InfoBubbleComponent,
  props: args,
  moduleMetadata: {
    declarations: [InfoBubbleComponent],
  },
  template: `<tsl-info-bubble></tsl-info-bubble>`,
});

export const Default = Template.bind({});
