import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { InfoBubbleComponent } from './info-bubble.component';
import { InfoBubbleModule } from './info-bubble.module';

export default {
  title: 'Webapp/Public/Features/Search/Components/InfoBubble',
  component: InfoBubbleComponent,
  decorators: [styledWrapperDecorator('max-width: 220px;')],
} as Meta;

const Template: Story<InfoBubbleComponent> = (args: InfoBubbleComponent) => ({
  component: InfoBubbleComponent,
  props: args,
  moduleMetadata: {
    imports: [InfoBubbleModule],
  },
  template: `<tsl-info-bubble>Random text</tsl-info-bubble>
  <tsl-info-bubble>Random LONG text Random LONG text Random LONG text Random LONG text</tsl-info-bubble>`,
});

export const Default = Template.bind({});
