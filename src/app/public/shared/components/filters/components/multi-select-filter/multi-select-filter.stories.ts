import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { Component, Input } from '@angular/core';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { HttpClientModule } from '@angular/common/http';
import { COMMON_CONFIGURATION_ID } from '../../core/enums/configuration-ids/common-configuration-ids.enum';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { FilterOptionService } from '../../../../services/filter-option/filter-option.service';
import { MockFilterOptionService } from '@fixtures/filter-option-service.fixtures.spec';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { MultiSelectFilterConfig } from './interfaces/multi-select-filter-config.interface';
import { MultiSelectFilterModule } from './multi-select-filter.module';

@Component({
  selector: 'tsl-filters',
  template: `
    <div>
      <h1>Bubble variant</h1>
      <div style="display: flex;">
        <div class="m-2" style="width: 100%">
          <tsl-multi-select-filter
            [variant]="${FILTER_VARIANT.BUBBLE}"
            [value]="subcategory"
            [config]="subcategoryConfig"
            (valueChange)="changeSubcategory($event)"
          >
          </tsl-multi-select-filter>
        </div>
      </div>

      <h1>Content variant</h1>
      <div style="border: 1px dashed black; background-color: white; position: relative; min-height: 400px;" class="p-3">
        <tsl-multi-select-filter
          [variant]="${FILTER_VARIANT.CONTENT}"
          [value]="subcategory"
          [config]="subcategoryConfig"
          (valueChange)="changeSubcategory($event)"
        >
        </tsl-multi-select-filter>
      </div>
    </div>
  `,
})
class FiltersComponent {
  @Input() public subcategory: FilterParameter[] = [];
  @Input() public subcategoryConfig: MultiSelectFilterConfig;

  public changeSubcategory(value: FilterParameter[]): void {
    console.log('FiltersComponent - changeSubcategory', value);
    this.subcategory = value;
  }
}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/MultiSelectFilter',
  decorators: [
    moduleMetadata({
      imports: [MultiSelectFilterModule, HttpClientModule],
      providers: [
        {
          provide: FilterOptionService,
          useClass: MockFilterOptionService,
        },
      ],
      declarations: [FiltersComponent],
    }),
  ],
} as Meta;

const Template: Story<FiltersComponent> = (args) => ({
  props: args,
  component: FiltersComponent,
});

const subcategoryConfig: MultiSelectFilterConfig = {
  id: COMMON_CONFIGURATION_ID.CONDITION,
  hasContentPlaceholder: true,
  title: 'Subcategory',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'Subcategory',
  drawerPlaceholder: 'Select Subcategory',
  mapKey: {
    parameterKey: FILTER_QUERY_PARAM_KEY.objectType,
  },
  type: FILTER_TYPES.MULTISELECT,
};

export const Default = Template.bind({});
Default.args = {
  subcategoryConfig,
};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = {
  subcategoryConfig: subcategoryConfig,
  subcategory: [{ key: FILTER_QUERY_PARAM_KEY.objectType, value: 'un_opened' }],
};
