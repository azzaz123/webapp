import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SelectOptionComponent } from './select-option.component';
import { SelectOptionModule } from './select-option.module';
import { HttpClientModule } from '@angular/common/http';

export default {
  title: 'Webapp/Shared/Form/Components/Select/SelectOption',
  decorators: [
    moduleMetadata({
      imports: [SelectOptionModule, HttpClientModule],
    }),
  ],
  argTypes: {
    onClick: { action: 'Option clicked' },
  },
};

const Template: Story<SelectOptionComponent> = (args) => ({
  props: args,
  component: SelectOptionComponent,
  template: `
    <div style="border: 1px dashed black; background-color: white" class="px-3">
      <tsl-select-option
        [label]="label" [icon]="icon" [sublabel]="sublabel" [isActive]="isActive"
        (click)="onClick()">
      </tsl-select-option>
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  label: 'Select me',
};

export const DefaultActive = Template.bind({});
DefaultActive.args = {
  label: 'Selected',
  isActive: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  label: 'I have an icon',
  icon: '/assets/icons/joke.svg',
};

export const WithIconActive = Template.bind({});
WithIconActive.args = {
  label: 'I have an icon',
  icon: '/assets/icons/joke.svg',
  isActive: true,
};

export const WithSublabel = Template.bind({});
WithSublabel.args = {
  label: 'Some important info',
  sublabel: 'Another important info',
};

export const WithSublabelActive = Template.bind({});
WithSublabelActive.args = {
  label: 'Some important info',
  sublabel: 'Another important info',
  isActive: true,
};

export const WithIconAndSublabel = Template.bind({});
WithIconAndSublabel.args = {
  label: 'Some important info',
  icon: '/assets/icons/joke.svg',
  sublabel: 'Another important info',
};

export const WithIconAndSublabelActive = Template.bind({});
WithIconAndSublabelActive.args = {
  label: 'Some important info',
  icon: '/assets/icons/joke.svg',
  sublabel: 'Another important info',
  isActive: true,
};
