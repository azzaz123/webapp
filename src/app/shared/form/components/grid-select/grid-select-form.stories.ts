import { moduleMetadata } from '@storybook/angular';
import { Story } from '@storybook/angular/types-6-0';
import { HttpClientModule } from '@angular/common/http';
import { GridSelectFormOption } from './interfaces/grid-select-form-option.interface';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GridSelectFormModule } from '@shared/form/components/grid-select/grid-select-form.module';

@Component({
  selector: 'tsl-story-grid-select-form',
  template: `
    <h4>NgModel: {{ select.join(', ') }}</h4>
    <div style="width: 400px">
      <div style="background: white; border: 1px dashed black;">
        <tsl-grid-select-form
          [(ngModel)]="select"
          [options]="options"
          [columns]="columns"
          [isBig]="isBig"
          [isMultiselect]="isMultiselect"
        ></tsl-grid-select-form>
      </div>
    </div>
    <h4 class="mt-4">FormGroup: {{ formGroup.value.select.join(', ') }}</h4>
    <div style="width: 400px">
      <div style="background: white; border: 1px dashed black;">
        <form [formGroup]="formGroup">
          <tsl-grid-select-form
            formControlName="select"
            [options]="options"
            [columns]="columns"
            [isBig]="isBig"
            [isMultiselect]="isMultiselect"
          ></tsl-grid-select-form>
        </form>
      </div>
    </div>
  `,
})
class StoryGridSelectFormFormComponent {
  @Input() options: GridSelectFormOption[];
  @Input() columns: number;
  @Input() isBig?: boolean;
  @Input() isMultiselect?: boolean;

  public formGroup = new FormGroup({
    select: new FormControl([]),
  });

  public select = [];
}

export default {
  title: 'Webapp/Shared/Form/Components/GridSelectForm',
  component: StoryGridSelectFormFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [StoryGridSelectFormFormComponent],
      imports: [HttpClientModule, ReactiveFormsModule, GridSelectFormModule],
    }),
  ],
};

const Template: Story<StoryGridSelectFormFormComponent> = (args) => ({
  props: args,
  component: StoryGridSelectFormFormComponent,
  template: `
    <tsl-story-grid-select-form [isBig]="isBig" [columns]="columns" [options]="options" [isMultiselect]="isMultiselect">
    </tsl-story-grid-select-form>
  `,
});

export const Default = Template.bind({});
Default.args = {
  options: getOptions(8, '/assets/icons/joke.svg', 'Joke', 'joke'),
  columns: 4,
};

export const Big = Template.bind({});
Big.args = {
  options: getOptions(8, '/assets/icons/joke.svg', 'Joke', 'joke'),
  columns: 4,
  isBig: true,
};

export const Columns3 = Template.bind({});
Columns3.args = {
  options: getOptions(8, '/assets/icons/joke.svg', 'Joke', 'joke'),
  columns: 3,
};

export const Multiselect = Template.bind({});
Multiselect.args = {
  options: getOptions(8, '/assets/icons/joke.svg', 'Joke', 'joke'),
  columns: 4,
  isMultiselect: true,
};

function getOptions(amount: number, icon: string, label: string, value: string): GridSelectFormOption[] {
  const arr = new Array(amount).fill(undefined);
  return arr.map((a, index) => ({
    label: `${label} ${index}`,
    value: `${value}_${index}`,
    icon,
  }));
}
