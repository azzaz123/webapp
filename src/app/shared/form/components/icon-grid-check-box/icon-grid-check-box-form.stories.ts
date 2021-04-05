import { moduleMetadata } from '@storybook/angular';
import { Story } from '@storybook/angular/types-6-0';
import { HttpClientModule } from '@angular/common/http';
import { IconGridCheckBoxOption } from './interfaces/icon-grid-check-box-option.interface';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IconGridCheckBoxFormModule } from '@shared/form/components/icon-grid-check-box/icon-grid-check-box-form.module';

@Component({
  selector: 'tsl-story-icon-grid-check-box',
  template: `
    <h4>NgModel: {{ select.join(', ') }}</h4>
    <div style="width: 400px">
      <div style="background: white; border: 1px dashed black;">
        <tsl-icon-grid-check-box-form
          [(ngModel)]="select"
          [options]="options"
          [columns]="columns"
          [isBig]="isBig"
          [isMultiselect]="isMultiselect"
        ></tsl-icon-grid-check-box-form>
      </div>
    </div>
    <h4 class="mt-4">FormGroup: {{ formGroup.value.select.join(', ') }}</h4>
    <div style="width: 400px">
      <div style="background: white; border: 1px dashed black;">
        <form [formGroup]="formGroup">
          <tsl-icon-grid-check-box-form
            formControlName="select"
            [options]="options"
            [columns]="columns"
            [isBig]="isBig"
            [isMultiselect]="isMultiselect"
          ></tsl-icon-grid-check-box-form>
        </form>
      </div>
    </div>
  `,
})
class StoryIconGridCheckBoxFormComponent {
  @Input() options: IconGridCheckBoxOption[];
  @Input() columns: number;
  @Input() isBig?: boolean;
  @Input() isMultiselect?: boolean;

  public formGroup = new FormGroup({
    select: new FormControl([]),
  });

  public select = [];
}

export default {
  title: 'Webapp/Shared/Form/Components/IconGridCheckBox',
  component: StoryIconGridCheckBoxFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [StoryIconGridCheckBoxFormComponent],
      imports: [HttpClientModule, ReactiveFormsModule, IconGridCheckBoxFormModule],
    }),
  ],
};

const Template: Story<StoryIconGridCheckBoxFormComponent> = (args) => ({
  props: args,
  component: StoryIconGridCheckBoxFormComponent,
  template: `
    <tsl-story-icon-grid-check-box [isBig]="isBig" [columns]="columns" [options]="options" [isMultiselect]="isMultiselect">
</tsl-story-icon-grid-check-box>
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

function getOptions(amount: number, icon: string, label: string, value: string): IconGridCheckBoxOption[] {
  const arr = new Array(amount).fill(undefined);
  return arr.map((a, index) => ({
    label: `${label} ${index}`,
    value: `${value}_${index}`,
    icon,
  }));
}
