import { moduleMetadata } from '@storybook/angular';
import { Story } from '@storybook/angular/types-6-0';
import { HttpClientModule } from '@angular/common/http';
import { IconGridOption } from './interfaces/icon-grid-option';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IconGridCheckFormModule } from '@shared/form/components/icon-grid-check/icon-grid-check-form.module';

@Component({
  selector: 'tsl-story-icon-grid-check',
  template: `
    <h4>NgModel: {{ select.join(', ') }}</h4>
    <div style="width: 400px">
      <div style="background: white; border: 1px dashed black;">
        <tsl-icon-grid-check-form
          [(ngModel)]="select"
          [options]="options"
          [columns]="columns"
          [isBig]="isBig"
          [isMultiselect]="isMultiselect"
        ></tsl-icon-grid-check-form>
      </div>
    </div>
    <h4 class="mt-4">FormGroup: {{ formGroup.value.select.join(', ') }}</h4>
    <div style="width: 400px">
      <div style="background: white; border: 1px dashed black;">
        <form [formGroup]="formGroup">
          <tsl-icon-grid-check-form
            formControlName="select"
            [options]="options"
            [columns]="columns"
            [isBig]="isBig"
            [isMultiselect]="isMultiselect"
          ></tsl-icon-grid-check-form>
        </form>
      </div>
    </div>
  `,
})
class StoryIconGridCheckFormComponent {
  @Input() options: IconGridOption[];
  @Input() columns: number;
  @Input() isBig?: boolean;
  @Input() isMultiselect?: boolean;

  public formGroup = new FormGroup({
    select: new FormControl([]),
  });

  public select = [];
}

export default {
  title: 'Webapp/Shared/Form/Components/IconGridCheck',
  component: StoryIconGridCheckFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [StoryIconGridCheckFormComponent],
      imports: [HttpClientModule, ReactiveFormsModule, IconGridCheckFormModule],
    }),
  ],
};

const Template: Story<StoryIconGridCheckFormComponent> = (args) => ({
  props: args,
  component: StoryIconGridCheckFormComponent,
  template: `
    <tsl-story-icon-grid-check [isBig]="isBig" [columns]="columns" [options]="options" [isMultiselect]="isMultiselect">
</tsl-story-icon-grid-check>
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

function getOptions(amount: number, icon: string, label: string, value: string): IconGridOption[] {
  const arr = new Array(amount).fill(undefined);
  return arr.map((a, index) => ({
    label: `${label} ${index}`,
    value: `${value}_${index}`,
    icon,
  }));
}
