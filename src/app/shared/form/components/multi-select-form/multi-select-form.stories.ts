import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, Story } from '@storybook/angular';
import { MultiSelectFormModule } from './multi-select-form.module';

@Component({
  selector: 'tsl-story-multi-select-form',
  template: `
    <h4 class="mt-4">MultiSelect FormGroup: {{ formGroup.value.select }}</h4>
    <div style="background: white; border: 1px dashed black;">
      <form [formGroup]="formGroup">
        <tsl-multi-select-form formControlName="select" [options]="options" [disabled]="disabled"></tsl-multi-select-form>
      </form>
      <button (click)="onClick()">Set value to cc</button>
    </div>
  `,
})
class StoryMultiSelectFormFormComponent {
  @Input() options;
  @Input() disabled: boolean = false;
  public formGroup = new FormGroup({
    select: new FormControl(['aa', 'bb']),
  });

  public onClick() {
    this.formGroup.get('select').setValue(['cc']);
  }
}

export default {
  title: 'Webapp/Shared/Form/Components/MultiSelectForm',
  component: StoryMultiSelectFormFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [StoryMultiSelectFormFormComponent],
      imports: [ReactiveFormsModule, MultiSelectFormModule, HttpClientModule],
    }),
  ],
};

const Template: Story<StoryMultiSelectFormFormComponent> = (args) => ({
  props: args,
  template: `
        <tsl-story-multi-select-form [disabled]="disabled" [options]="options"></tsl-story-multi-select-form>
      `,
});

const optionsWithLabels = [
  { label: 'aa', value: 'aa' },
  { label: 'bb', value: 'bb' },
  { label: 'cc', value: 'cc' },
  { label: 'dd', value: 'dd' },
];

const optionsWithSublabel = optionsWithLabels.map((option, index) => {
  index++;
  option['sublabel'] = index;
  return option;
});

export const Default = Template.bind({});
Default.args = {
  options: optionsWithLabels,
  disabled: 'false',
};

export const DisableMultiSelect = Template.bind({});
DisableMultiSelect.args = {
  options: optionsWithLabels,
  disabled: 'true',
};

export const OptionsWithOccurrences = Template.bind({});
OptionsWithOccurrences.args = {
  options: optionsWithSublabel,
  disabled: 'false',
};
