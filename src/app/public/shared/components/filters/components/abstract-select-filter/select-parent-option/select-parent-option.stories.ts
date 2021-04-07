import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SelectParentOptionModule } from './select-parent-option.module';
import { SelectParentOptionComponent } from './select-parent-option.component';
import { HttpClientModule } from '@angular/common/http';

export default {
  title: 'Webapp/Public/Shared/Components/Filters/AbstractSelectFilter/SelectParentOption',
  decorators: [
    moduleMetadata({
      imports: [SelectParentOptionModule, HttpClientModule],
    }),
  ],
  argTypes: {
    onClear: { action: 'I need to be cleared!' },
    onClick: { action: 'Option clicked' },
  },
};

const Template: Story<SelectParentOptionComponent> = (args) => ({
  props: args,
  component: SelectParentOptionComponent,
  template: `
    <div style="border: 1px dashed black; background-color: white" class="px-3">
      <tsl-select-parent-option [label]="label" [sublabel]="sublabel" [icon]="icon" [isClearable]="isClearable" (click)="onClick()" (clear)="onClear()"></tsl-select-parent-option>
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  label: 'I am a father',
};

export const DefaultWithSublabel = Template.bind({});
DefaultWithSublabel.args = {
  label: 'I am a father',
  sublabel: 'with sublabel',
};

export const DefaultWithIcon = Template.bind({});
DefaultWithIcon.args = {
  label: 'I am a father',
  icon: '/assets/icons/categories/normal/All.svg',
};

export const Clearable = Template.bind({});
Clearable.args = {
  label: 'I am a father',
  isClearable: true,
};
