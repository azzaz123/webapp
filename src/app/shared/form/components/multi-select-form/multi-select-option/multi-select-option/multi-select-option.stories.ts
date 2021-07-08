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
    <div style="background: white; border: 1px dashed black;">
        <tsl-multi-select-option [option]="option" [isDisabled]="isDisabled"></tsl-multi-select-option>
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
  isDisabled: false,
};

export const WithSublabel = Template.bind({});
WithSublabel.args = {
  option: { label: 'aa', value: 'aa', sublabel: '1', checked: false },
  isDisabled: false,
};

export const DisabledOption = Template.bind({});
DisabledOption.args = {
  ...Default.args,
  isDisabled: true,
};
