import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { Component, Input } from '@angular/core';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { HttpClientModule } from '@angular/common/http';
import { COMMON_CONFIGURATION_ID } from '../../core/enums/configuration-ids/common-configuration-ids.enum';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { CategoriesFilterComponent } from './categories-filter.component';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { AbstractSelectFilterModule } from '../abstract-select-filter/abstract-select-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { GridSelectFormModule } from '@shared/form/components/grid-select/grid-select-form.module';
import { CategoriesFilterConfig } from './interfaces/categories-filter-config.interface';
import { CATEGORY_OPTIONS } from './data/category_options';
import { FormatSelectOptionsPipe } from '@public/shared/components/filters/components/categories-filter/pipes/format-select-options.pipe';
import { IsBubblePipe } from '@public/shared/components/filters/components/abstract-filter/pipes/is-bubble.pipe';

@Component({
  selector: 'tsl-filters',
  template: `
    <div>
      <h1>Bubble variant</h1>
      <tsl-categories-filter
        [variant]="${FILTER_VARIANT.BUBBLE}"
        [value]="categoriesValue"
        [config]="categoriesConfig"
        (valueChange)="changeCondition($event)"
        (clear)="changeCondition([])"
      >
      </tsl-categories-filter>

      <h1>Content variant</h1>
      <div style="border: 1px dashed black; background-color: white; position: relative; min-height: 400px;" class="p-3">
        <tsl-categories-filter
          [variant]="${FILTER_VARIANT.CONTENT}"
          [value]="categoriesValue"
          [config]="categoriesConfig"
          (valueChange)="changeCondition($event)"
          (clear)="changeCondition([])"
        >
        </tsl-categories-filter>
      </div>
    </div>
  `,
})
class FiltersComponent {
  @Input() public categoriesValue: FilterParameter[];
  @Input() public categoriesConfig: CategoriesFilterConfig;

  public changeCondition(value: FilterParameter[]): void {
    this.categoriesValue = value;
  }
}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/CategoriesFilter',
  decorators: [
    moduleMetadata({
      imports: [
        HttpClientModule,
        AbstractFilterModule,
        AbstractSelectFilterModule,
        FormsModule,
        ReactiveFormsModule,
        GridSelectFormModule,
        SelectFormModule,
      ],
      declarations: [FiltersComponent, CategoriesFilterComponent, FormatSelectOptionsPipe, IsBubblePipe],
    }),
  ],
} as Meta;

const Template: Story<FiltersComponent> = (args) => ({
  props: args,
  component: FiltersComponent,
});

const categoriesConfig: CategoriesFilterConfig = {
  id: COMMON_CONFIGURATION_ID.CATEGORIES,
  title: 'Category',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'All categories',
  drawerPlaceholder: 'All categories',
  mapKey: {
    parameterKey: 'category_ids',
  },
  type: FILTER_TYPES.CATEGORIES,
  options: CATEGORY_OPTIONS,
};

export const Default = Template.bind({});
Default.args = {
  categoriesConfig: categoriesConfig,
};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = {
  categoriesConfig: categoriesConfig,
  categoriesValue: [{ key: 'category_ids', value: '100' }],
};
