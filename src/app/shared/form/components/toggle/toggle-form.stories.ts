import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { Component } from '@angular/core';
import { ToggleFormModule } from './toggle-form.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'tsl-story-toggle',
  template: `
    <h4>NgModel: {{ toggle }}</h4>
    <tsl-toggle-form [(ngModel)]="toggle" [isDisabled]="isDisabled"></tsl-toggle-form>
    <h4 class="mt-4">FormGroup: {{ formGroup.value.toggle }}</h4>
    <form [formGroup]="formGroup">
      <tsl-toggle-form formControlName="toggle" [isDisabled]="isDisabled"></tsl-toggle-form>
    </form>
  `,
})
class StoryToggleFormComponent {
  value: boolean;

  formGroup = new FormGroup({
    toggle: new FormControl(),
  });

  toggle: boolean;
}

export default {
  title: 'Webapp/Shared/Form/Components/Toggle',
  component: StoryToggleFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [StoryToggleFormComponent],
      imports: [ToggleFormModule, ReactiveFormsModule, FormsModule],
    }),
  ],
};

const Template: Story<StoryToggleFormComponent> = (args) => ({
  props: args,
  component: StoryToggleFormComponent,
});

export const Default = Template.bind({});
Default.args = {};

export const Disabled = Template.bind({});
Disabled.args = {
  isDisabled: true,
};
