import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, Story } from '@storybook/angular';
import { SelectFormOption } from '../select/interfaces/select-form-option.interface';
import { MultiSelectFormModule } from './multi-select-form.module';
import { MultiSelectOptionModule } from './multi-select-option/multi-select-option/multi-select-option.module';

@Component({
  selector: 'tsl-story-multi-select-form',
  template: `
    <h4 class="mt-4">MultiSelect FormGroup: {{ formGroup.value.select }}</h4>
    <div style="background: white; border: 1px dashed black;">
      {{ options[0].value }}
      <form [formGroup]="formGroup">
        <tsl-multi-select-form formControlName="select" [options]="options"></tsl-multi-select-form>
      </form>
    </div>
  `,
})
class StoryMultiSelectFormFormComponent {
  @Input() options: SelectFormOption<string>[];
  @Input() isDisabled: boolean = false;
  public formGroup = new FormGroup({
    select: new FormControl(['default']),
  });
  public select = ['default'];
}

export default {
  title: 'Webapp/Shared/Form/Components/MultiSelectForm',
  component: StoryMultiSelectFormFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [StoryMultiSelectFormFormComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule, MultiSelectFormModule, MultiSelectOptionModule],
    }),
  ],
};

const Template: Story<StoryMultiSelectFormFormComponent> = (args) => ({
  props: args,
  template: `
        <tsl-story-multi-select-form [isDisabled]="false" [options]="options"></tsl-story-multi-select-form>
      `,
});

export const Default = Template.bind({});
Default.args = {
  options: [
    { label: 'aa', value: 'aa' },
    { label: 'bb', value: 'bb' },
    { label: 'cc', value: 'cc' },
    { label: 'dd', value: 'dd' },
  ],
};

export const OptionsWithOccurrencies = Template.bind({});
OptionsWithOccurrencies.args = {
  options: [
    { label: 'aa', sublabel: 1, value: 'aa' },
    { label: 'bb', sublabel: 2, value: 'bb' },
    { label: 'cc', sublabel: 3, value: 'cc' },
    { label: 'dd', sublabel: 4, value: 'dd' },
  ],
};
