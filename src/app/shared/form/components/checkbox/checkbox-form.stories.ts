import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { Component } from '@angular/core';
import { CheckboxFormModule } from './checkbox-form.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'tsl-story-checkbox',
  template: `
    <h4>NgModel: {{ checkbox }}</h4>
    <tsl-checkbox-form [(ngModel)]="checkbox"></tsl-checkbox-form>
    <h4 class="mt-4">FormGroup: {{ formGroup.value.checkbox }}</h4>
    <form [formGroup]="formGroup">
      <tsl-checkbox-form formControlName="checkbox"></tsl-checkbox-form>
    </form>
  `,
})
class StoryCheckboxFormComponent {
  value: boolean;

  formGroup = new FormGroup({
    checkbox: new FormControl(),
  });

  checkbox: boolean;
}

export default {
  title: 'Webapp/Shared/Form/Components/Checkbox',
  component: StoryCheckboxFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [StoryCheckboxFormComponent],
      imports: [CheckboxFormModule, ReactiveFormsModule, FormsModule],
    }),
  ],
};

const Template: Story<StoryCheckboxFormComponent> = (args) => ({
  props: args,
  component: StoryCheckboxFormComponent,
});

export const Default = Template.bind({});
Default.args = {};
