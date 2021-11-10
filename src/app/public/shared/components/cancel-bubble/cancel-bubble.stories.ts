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
  <div>
  <tsl-cancel-bubble [text]="text"></tsl-cancel-bubble>
  <tsl-cancel-bubble [text]="text"></tsl-cancel-bubble>
  <tsl-cancel-bubble [text]="text"></tsl-cancel-bubble>
  <tsl-cancel-bubble [text]="text"></tsl-cancel-bubble>
  <tsl-cancel-bubble [text]="text"></tsl-cancel-bubble>
  </div>
  <tsl-cancel-bubble [text]="text"></tsl-cancel-bubble>`,
  styles: ['tsl-cancel-bubble {margin: 8px; max-width: 200px;}'],
});

export const Default = Template.bind({});
Default.args = {
  text: 'Bubble',
};

export const LongText = Template.bind({});
LongText.args = {
  text: 'SuperLongTextSJOIJDOJFUHOU',
};
