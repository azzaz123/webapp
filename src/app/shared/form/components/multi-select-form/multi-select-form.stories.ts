import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SUBCATEGORIES_MOCK, SUBCATEGORIES_WITH_CHILDREN_MOCK } from '@fixtures/subcategories.fixtures';
import { moduleMetadata, Story } from '@storybook/angular';
import { MultiSelectFormOption } from './interfaces/multi-select-form-option.interface';
import { MultiSelectFormModule } from './multi-select-form.module';

@Component({
  selector: 'tsl-story-multi-select-form',
  template: `
    <h4 class="mt-4">MultiSelect FormGroup: {{ formGroup.value.select }}</h4>
    <h5 *ngIf="max">Max restriction set to: {{ max }}</h5>
    <div style="background: white;background: white;height: 300px;">
      <form [formGroup]="formGroup" style="height:100%">
        <tsl-multi-select-form formControlName="select" [options]="options" [disabled]="disabled" [max]="max"></tsl-multi-select-form>
      </form>
    </div>

    <button class="mt-4 btn btn-secondary" (click)="onClick()">Set value to "Anoraks y chubasqueros"</button>
  `,
})
class StoryMultiSelectFormFormComponent {
  @Input() options: MultiSelectFormOption[];
  @Input() disabled: boolean = false;
  public formGroup = new FormGroup({
    select: new FormControl(['9568', '1']),
  });

  public onClick() {
    this.formGroup.get('select').setValue(['9577']);
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

export const Default = Template.bind({});
Default.args = {
  options: SUBCATEGORIES_MOCK,
};

export const WithMaxRestriction = Template.bind({});
WithMaxRestriction.args = {
  options: SUBCATEGORIES_MOCK,
  max: 4,
};

export const WithNestedOptions = Template.bind({});
WithNestedOptions.args = {
  options: SUBCATEGORIES_WITH_CHILDREN_MOCK,
};
