import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { moduleMetadata, Story } from '@storybook/angular';
import { SelectFormOption } from '../select/interfaces/select-form-option.interface';
import { SelectFormModule } from '../select/select-form.module';
import { MultiSelectOptionModule } from './multi-select-option/multi-select-option/multi-select-option.module';

@Component({
  selector: 'tsl-story-multi-select-form',
  template: `
    <div style="background: white; border: 1px dashed black;">
      <h4>MultiSelect</h4>
      <tsl-multi-select-form formControlName="hashtagSuggestors" [options]="options"></tsl-multi-select-form>
    </div>
  `,
})
class StoryMultiSelectFormFormComponent {
  @Input() options: SelectFormOption<string>[];
  public formGroup = new FormGroup({
    hashtagSuggestors: new FormControl('ww'),
  });
}

export default {
  title: 'Webapp/Shared/Form/Components/MultiSelectForm',
  component: StoryMultiSelectFormFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [StoryMultiSelectFormFormComponent],
      imports: [CommonModule, FormsModule, SelectFormModule, MultiSelectOptionModule],
    }),
  ],
};

const Template: Story<StoryMultiSelectFormFormComponent> = (args) => ({
  props: args,
  template: `
        <h3>test</h3>
        <tsl-story-multi-select-form [options]="options"></tsl-story-multi-select-form>
      `,
});

export const Default = Template.bind({});
Default.args = {
  options: ['1', '2'],
  /*  options: [
    { label: 'aa', value: 'aa' },
    { label: 'bb', value: 'bb' },
    { label: 'cc', value: 'cc' },
    { label: 'dd', value: 'dd' },
  ], */
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
