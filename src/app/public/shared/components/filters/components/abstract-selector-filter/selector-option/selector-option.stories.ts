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
      <tsl-selector-option [label]="label" [icon]="icon" [sublabel]="sublabel" [isActive]="isActive">
      </tsl-selector-option>
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
  icon: {
    stroke: '/assets/icons/categories/stroke/All.svg',
    selected: '/assets/icons/categories/selected/All.svg',
  },
};

export const WithIconActive = Template.bind({});
WithIconActive.args = {
  label: 'I have an icon',
  icon: {
    stroke: '/assets/icons/categories/stroke/All.svg',
    selected: '/assets/icons/categories/selected/All.svg',
  },
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
  icon: {
    stroke: '/assets/icons/categories/stroke/All.svg',
    selected: '/assets/icons/categories/selected/All.svg',
  },
  sublabel: 'Another important info',
};

export const WithIconAndSublabelActive = Template.bind({});
WithIconAndSublabelActive.args = {
  label: 'Some important info',
  icon: {
    stroke: '/assets/icons/categories/stroke/All.svg',
    selected: '/assets/icons/categories/selected/All.svg',
  },
  sublabel: 'Another important info',
  isActive: true,
};
