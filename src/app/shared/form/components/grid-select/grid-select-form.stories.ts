import { moduleMetadata } from '@storybook/angular';
import { Story } from '@storybook/angular/types-6-0';
import { HttpClientModule } from '@angular/common/http';
import { GridSelectFormOption } from './interfaces/grid-select-form-option.interface';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridSelectFormModule } from '@shared/form/components/grid-select/grid-select-form.module';
import { FormComplexIcon } from '@shared/form/interfaces/form-complex-icon.interface';

@Component({
  selector: 'tsl-story-grid-select-form',
  template: `
    <h4>NgModel: {{ select.join(', ') }}</h4>
    <div [style.width]="isWrapperBig ? '850px' : '400px'">
      <div style="background: white; border: 1px dashed black;">
        <tsl-grid-select-form
          [(ngModel)]="select"
          [options]="options"
          [columns]="columns"
          [isBig]="isBig"
          [isMultiselect]="isMultiselect"
          [isHoverMainColor]="isHoverMainColor"
        ></tsl-grid-select-form>
      </div>
    </div>
    <h4 class="mt-4">FormGroup: {{ formGroup.value.select.join(', ') }}</h4>
    <div [style.width]="isWrapperBig ? '850px' : '400px'">
      <div style="background: white; border: 1px dashed black;">
        <form [formGroup]="formGroup">
          <tsl-grid-select-form
            formControlName="select"
            [options]="options"
            [columns]="columns"
            [isBig]="isBig"
            [isMultiselect]="isMultiselect"
            [isHoverMainColor]="isHoverMainColor"
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
  @Input() isHoverMainColor?: boolean;
  @Input() isWrapperBig?: boolean;

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
      imports: [HttpClientModule, ReactiveFormsModule, FormsModule, GridSelectFormModule],
    }),
  ],
};

const Template: Story<StoryGridSelectFormFormComponent> = (args) => ({
  props: args,
  component: StoryGridSelectFormFormComponent,
  template: `
    <tsl-story-grid-select-form [isBig]="isBig"
                                [columns]="columns"
                                [options]="options"
                                [isMultiselect]="isMultiselect"
                                [isHoverMainColor]="isHoverMainColor"
                                [isWrapperBig]="isWrapperBig">
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

export const ComplexIcon = Template.bind({});
ComplexIcon.args = {
  isWrapperBig: true,
  isHoverMainColor: true,
  isBig: true,
  options: getOptions(
    12,
    {
      standard: '/assets/icons/filters/categories/all.svg',
      hover: '/assets/icons/filters/categories/all_hover.svg',
      active: '/assets/icons/filters/categories/all_selected.svg',
    },
    'All categories',
    'categories'
  ),
  columns: 6,
};

function getOptions(amount: number, icon: string | FormComplexIcon, label: string, value: string): GridSelectFormOption[] {
  const arr = new Array(amount).fill(undefined);
  return arr.map((a, index) => ({
    label: `${label} ${index}`,
    value: `${value}_${index}`,
    icon,
  }));
}
