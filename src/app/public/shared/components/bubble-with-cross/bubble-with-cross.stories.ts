import { CoreModule } from '@core/core.module';
import { HttpModule } from '@core/http/http.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { moduleMetadata, Story } from '@storybook/angular';
import { BubbleComponent } from '../bubble/bubble.component';
import { BubbleWithCrossComponent } from './bubble-with-cross.component';

export default {
  title: 'Webapp/Public/Shared/Components/BubbleWithCross',
  component: BubbleWithCrossComponent,
  decorators: [
    moduleMetadata({
      declarations: [BubbleComponent],
      imports: [CoreModule, HttpModule, SvgIconModule],
    }),
  ],
};

const Template: Story<BubbleWithCrossComponent> = (args) => ({
  props: args,
  template: `
  <div style="width:150px; margin-bottom:15px;">
  <tsl-bubble-with-cross  [bubbleText]="bubbleText"></tsl-bubble-with-cross>
  </div>
  <tsl-bubble-with-cross [bubbleText]="bubbleText"></tsl-bubble-with-cross>`,
});

export const Default = Template.bind({});
Default.args = {
  bubbleText: 'Bubble',
};
