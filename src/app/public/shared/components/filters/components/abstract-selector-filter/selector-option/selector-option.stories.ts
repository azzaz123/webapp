import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SelectorOptionComponent } from './selector-option.component';
import { SelectorOptionModule } from './selector-option.module';

export default {
  title: 'Webapp/Public/Shared/Components/Filters/AbstractSelectorFilter/SelectorOption',
  decorators: [
    moduleMetadata({
      imports: [SelectorOptionModule],
    }),
  ],
};

const Template: Story<SelectorOptionComponent> = (args) => ({
  props: args,
  component: SelectorOptionComponent,
  template: `
    <div style="border: 1px dashed black; background-color: white">
      <tsl-selector-option [label]="label" [icon]="icon" [sublabel]="sublabel"></tsl-selector-option>
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  label: 'Select me',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  label: 'I have an icon',
  icon: '/assets/icons/joke.svg',
};

export const WithSublabel = Template.bind({});
WithSublabel.args = {
  label: 'Some important info',
  sublabel: 'Another important info',
};

export const WithIconAndSublabel = Template.bind({});
WithIconAndSublabel.args = {
  label: 'Some important info',
  icon: '/assets/icons/joke.svg',
  sublabel: 'Another important info',
};
