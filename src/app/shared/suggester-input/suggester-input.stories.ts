import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SuggesterInputComponent } from './suggester-input.component';
import { CommonModule } from '@angular/common';

export default {
  title: 'Webapp/Shared/SuggesterInput',
  component: SuggesterInputComponent,
  decorators: [
    moduleMetadata({
      declarations: [SuggesterInputComponent],
      imports: [CommonModule],
    }),
  ],
};

const Template: Story<SuggesterInputComponent> = (args) => ({
  props: args,
  template: `
      <tsl-suggester-input></tsl-suggester-input>
    `,
});

export const Default = Template.bind({});
Default.args = {};
