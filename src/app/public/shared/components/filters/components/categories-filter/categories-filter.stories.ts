import { moduleMetadata } from '@storybook/angular';
import { Meta } from '@storybook/angular/types-6-0';
import { Story } from '@storybook/angular/ts3.4/dist/client';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { Component, Input } from '@angular/core';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { HttpClientModule } from '@angular/common/http';
import { COMMON_CONFIGURATION_ID } from '../../core/enums/configuration-ids/common-configuration-ids.enum';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { SelectParentOptionComponent } from '../abstract-select-filter/select-parent-option/select-parent-option.component';
import { SelectFormComponent } from '@shared/form/components/select/select-form.component';
import { FilterConfig } from '../../interfaces/filter-config.interface';
import { CategoriesFilterParams } from './interfaces/categories-filter-params.interface';
import { CategoriesFilterComponent } from './categories-filter.component';
import { GridSelectFormComponent } from '@shared/form/components/grid-select/grid-select-form.component';

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
  public categoriesValue: FilterParameter[];
  @Input() public categoriesConfig: FilterConfig<CategoriesFilterParams>;

  public changeCondition(value: FilterParameter[]): void {
    this.categoriesValue = value;
  }
}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/CategoriesFilter',
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule],
      declarations: [
        FiltersComponent,
        CategoriesFilterComponent,
        SelectFormComponent,
        GridSelectFormComponent,
        SelectParentOptionComponent,
      ],
    }),
  ],
} as Meta;

const Template: Story<FiltersComponent> = (args) => ({
  props: args,
  component: FiltersComponent,
});

const categoriesConfig: FilterConfig<CategoriesFilterParams> = {
  id: COMMON_CONFIGURATION_ID.CATEGORIES,
  title: 'Category',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'Condition',
  drawerPlaceholder: 'All categories',
  mapKey: {
    parameterKey: 'category_ids',
  },
  type: FILTER_TYPES.CATEGORIES,
};

export const Default = Template.bind({});
Default.args = {
  categoriesConfig: categoriesConfig,
};
