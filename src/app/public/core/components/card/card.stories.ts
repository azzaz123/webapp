import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { CardComponent } from './card.component';

export default {
  title: 'Webapp/Card',
  decorators: [
    moduleMetadata({
      declarations: [CardComponent],
      imports: [],
    }),
  ],
} as Meta;

const Template: Story<CardComponent> = (args: CardComponent) => ({
  component: CardComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {};
