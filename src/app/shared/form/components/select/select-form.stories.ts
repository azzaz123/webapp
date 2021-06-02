import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectFormModule } from './select-form.module';
import { SelectFormOption } from './interfaces/select-form-option.interface';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'tsl-story-select',
  template: `
    <h4>NgModel: {{ select }}</h4>
    <div style="background: white; border: 1px dashed black;">
      <tsl-select-form [(ngModel)]="select" [options]="options"></tsl-select-form>
    </div>
    <h4 class="mt-4">FormGroup: {{ formGroup.value.select }}</h4>
    <div style="background: white; border: 1px dashed black;">
      <form [formGroup]="formGroup">
        <tsl-select-form formControlName="select" [options]="options"></tsl-select-form>
      </form>
    </div>
  `,
})
class StorySelectFormComponent {
  @Input() options: SelectFormOption<string>[];

  public formGroup = new FormGroup({
    select: new FormControl('default'),
  });

  public select = 'default';
}

export default {
  title: 'Webapp/Shared/Form/Components/Select',
  component: StorySelectFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [StorySelectFormComponent],
      imports: [SelectFormModule, ReactiveFormsModule, HttpClientModule, FormsModule],
    }),
  ],
};

const Template: Story<StorySelectFormComponent> = (args) => ({
  props: args,
  template: `
      <tsl-story-select [options]="options"></tsl-story-select>
    `,
});

export const Default = Template.bind({});
Default.args = {
  options: [
    {
      label: 'Basic option',
      value: 'basic',
    },
    {
      label: 'Basic option',
      sublabel: 'with sublabel',
      value: 'sublabel',
    },
    {
      label: 'Icon option',
      value: 'icon',
      icon: '/assets/icons/joke.svg',
    },
    {
      label: 'Icon option',
      sublabel: 'with sublabel',
      icon: '/assets/icons/joke.svg',
      value: 'complete',
    },
  ],
};
