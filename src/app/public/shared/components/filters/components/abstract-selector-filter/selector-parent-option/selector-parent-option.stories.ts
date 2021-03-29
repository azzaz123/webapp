import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SelectorParentOptionModule } from './selector-parent-option.module';
import { SelectorParentOptionComponent } from './selector-parent-option.component';
import { HttpClientModule } from '@angular/common/http';

export default {
  title: 'Webapp/Public/Shared/Components/Filters/AbstractSelectorFilter/SelectorParentOption',
  decorators: [
    moduleMetadata({
      imports: [SelectorParentOptionModule, HttpClientModule],
    }),
  ],
  argTypes: {
    onClear: { action: 'I need to be cleared!' },
    onClick: { action: 'Option clicked' },
  },
};

const Template: Story<SelectorParentOptionComponent> = (args) => ({
  props: args,
  component: SelectorParentOptionComponent,
  template: `
    <div style="border: 1px dashed black; background-color: white" class="px-3">
      <tsl-selector-parent-option [label]="label" [sublabel]="sublabel" [icon]="icon" [isClearable]="isClearable" (click)="onClick()" (clear)="onClear()"></tsl-selector-parent-option>
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
