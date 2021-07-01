import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { moduleMetadata, Story } from '@storybook/angular';
import { MultiSelectOptionComponent } from './multi-select-option.component';
import { MultiSelectOptionModule } from './multi-select-option.module';

export default {
  title: 'Webapp/Shared/Form/Components/MultiSelectForm/MultiSelectOption',
  decorators: [
    moduleMetadata({
      imports: [MultiSelectOptionModule, CommonModule, FormsModule, CoreModule, HttpClientModule, SvgIconModule],
    }),
  ],
  argTypes: {
    onChange: { action: 'Option clicked' },
  },
};

const Template: Story<MultiSelectOptionComponent> = (args) => ({
  props: args,
  component: MultiSelectOptionComponent,
  template: `
    <div style="background: white; border: 1px dashed black;">
    <div *ngIf="isDisabled">heys</div>
        <tsl-multi-select-option [isDisabled]="isDisabled" (change)="onChange()"></tsl-multi-select-option>
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
  isDisabled: true,
};

export const WithSublabel = Template.bind({});
Default.args = {
  label: 'aa',
  value: 'aa',
  sublabel: '1',
  checked: false,
};
