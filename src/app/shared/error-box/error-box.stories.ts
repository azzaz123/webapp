import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { ErrorBoxComponent } from './error-box.component';

export default {
  title: 'Webapp/ErrorBox',
  decorators: [
    moduleMetadata({
      declarations: [ErrorBoxComponent],
    }),
  ],
} as Meta;

const Template: Story<ErrorBoxComponent> = (args: ErrorBoxComponent) => ({
  component: ErrorBoxComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {};
