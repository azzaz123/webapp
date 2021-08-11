import { CoreModule } from '@core/core.module';
import { HttpModule } from '@core/http/http.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { moduleMetadata, Story } from '@storybook/angular';
import { BubbleComponent } from '../bubble/bubble.component';
import { CancelBubbleComponent } from './cancel-bubble.component';

export default {
  title: 'Webapp/Public/Shared/Components/CancelBubble',
  component: CancelBubbleComponent,
  decorators: [
    moduleMetadata({
      declarations: [BubbleComponent],
      imports: [CoreModule, HttpModule, SvgIconModule],
    }),
  ],
};

const Template: Story<CancelBubbleComponent> = (args) => ({
  props: args,
  template: `
  <div style="width:132px; margin:35px;">
  <tsl-cancel-bubble [bubbleText]="bubbleText"></tsl-cancel-bubble>
  <tsl-cancel-bubble [bubbleText]="bubbleText"></tsl-cancel-bubble>
  <tsl-cancel-bubble [bubbleText]="bubbleText"></tsl-cancel-bubble>
  <tsl-cancel-bubble [bubbleText]="bubbleText"></tsl-cancel-bubble>
  <tsl-cancel-bubble [bubbleText]="bubbleText"></tsl-cancel-bubble>
  </div>
  <tsl-cancel-bubble [bubbleText]="bubbleText"></tsl-cancel-bubble>`,
});

export const Default = Template.bind({});
Default.args = {
  bubbleText: 'Bubble',
};

export const LongText = Template.bind({});
Default.args = {
  bubbleText: 'SuperLongTextSJOIJDOJFUHOU',
};
