import { HttpClientModule } from '@angular/common/http';
import { moduleMetadata, Story } from '@storybook/angular';
import { MultiSelectOptionComponent } from './multi-select-option.component';
import { MultiSelectOptionModule } from './multi-select-option.module';

export default {
  title: 'Webapp/Shared/Form/Components/MultiSelectForm/MultiSelectOption',
  decorators: [
    moduleMetadata({
      imports: [MultiSelectOptionModule, HttpClientModule],
    }),
  ],
};

const Template: Story<MultiSelectOptionComponent> = (args) => ({
  props: args,
  component: MultiSelectOptionComponent,
  template: `
    <div style="background: white;">
        <tsl-multi-select-option [option]="option" [isDisabled]="disabled" [hasChildren]="hasChildren"></tsl-multi-select-option>
    </div>
    `,
});

export const Default = Template.bind({});
Default.args = {
  option: {
    label: 'aa',
    value: 'aa',
    checked: false,
  },
  disabled: false,
};

export const WithSublabel = Template.bind({});
WithSublabel.args = {
  option: { label: 'aa', value: 'aa', sublabel: '1', checked: false },
  disabled: false,
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  option: {
    label: 'aa',
    value: 'aa',
    checked: false,
  },
  disabled: false,
  hasChildren: true,
};

export const DisabledOption = Template.bind({});
DisabledOption.args = {
  ...Default.args,
  disabled: true,
};
