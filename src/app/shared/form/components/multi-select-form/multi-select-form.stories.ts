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
        <tsl-multi-select-form formControlName="select" [options]="options" [isDisabled]="isDisabled"></tsl-multi-select-form>
      </form>
    </div>
  `,
})
class StoryMultiSelectFormFormComponent {
  @Input() options;
  @Input() isDisabled: boolean = false;
  public formGroup = new FormGroup({
    select: new FormControl(['aa']),
  });
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
        <tsl-story-multi-select-form [isDisabled]="isDisabled" [options]="options"></tsl-story-multi-select-form>
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
  isDisabled: 'false',
};

export const DisableMultiSelect = Template.bind({});
DisableMultiSelect.args = {
  options: [
    { label: 'aa', value: 'aa' },
    { label: 'bb', value: 'bb' },
    { label: 'cc', value: 'cc' },
    { label: 'dd', value: 'dd' },
  ],
  isDisabled: 'true',
};

export const OptionsWithOccurrencies = Template.bind({});
OptionsWithOccurrencies.args = {
  options: [
    { label: 'aa', sublabel: 1, value: 'aa' },
    { label: 'bb', sublabel: 2, value: 'bb' },
    { label: 'cc', sublabel: 3, value: 'cc' },
    { label: 'dd', sublabel: 4, value: 'dd' },
  ],
  isDisabled: 'false',
};
