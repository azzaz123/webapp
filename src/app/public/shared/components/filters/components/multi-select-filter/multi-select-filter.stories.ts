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
import { FASHION_CONFIGURATION_ID } from '../../core/enums/configuration-ids/fashion-configuration-ids.enum';
import { SUBCATEGORIES_WITH_CHILDREN_MOCK } from '@fixtures/subcategories.fixtures';
import { MULTISELECT_FILTER_BUBBLE_VARIANT } from './enum/multi-select-filter-bubble-variant.enum';

@Component({
  selector: 'tsl-filters',
  template: `
    <div>
      <h1>Bubble variant</h1>
      <div style="display: flex;">
        <div class="m-2" style="width: 100%">
          <tsl-multi-select-filter
            [variant]="${FILTER_VARIANT.BUBBLE}"
            [value]="value"
            [config]="config"
            (valueChange)="changeValue($event)"
          >
          </tsl-multi-select-filter>
        </div>
      </div>

      <h1>Content variant</h1>
      <div style="border: 1px dashed black; background-color: white; position: relative; min-height: 400px;" class="p-3">
        <tsl-multi-select-filter
          [variant]="${FILTER_VARIANT.CONTENT}"
          [value]="value"
          [config]="config"
          (valueChange)="changeValue($event)"
        >
        </tsl-multi-select-filter>
      </div>
    </div>
  `,
})
class FiltersComponent {
  @Input() public value: FilterParameter[] = [];
  @Input() public config: MultiSelectFilterConfig;

  public changeValue(value: FilterParameter[]): void {
    this.value = value;
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

const conditionConfig: MultiSelectFilterConfig = {
  id: COMMON_CONFIGURATION_ID.CONDITION,
  hasContentPlaceholder: true,
  title: 'Condition',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'Condition',
  drawerPlaceholder: 'Select Condition',
  mapKey: {
    parameterKey: FILTER_QUERY_PARAM_KEY.condition,
  },
  type: FILTER_TYPES.MULTISELECT,
  bubbleVariant: MULTISELECT_FILTER_BUBBLE_VARIANT.MULTIPLE,
};

const subcategoryConfig: MultiSelectFilterConfig = {
  id: FASHION_CONFIGURATION_ID.OBJECT_TYPE,
  hasContentPlaceholder: true,
  title: 'Subcategory',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'Subcategory',
  drawerPlaceholder: 'Select Subcategory',
  mapKey: {
    parameterKey: FILTER_QUERY_PARAM_KEY.objectType,
  },
  type: FILTER_TYPES.MULTISELECT,
  bubbleVariant: MULTISELECT_FILTER_BUBBLE_VARIANT.MULTIPLE,
};

export const Default = Template.bind({});
Default.args = {
  config: conditionConfig,
};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = {
  config: subcategoryConfig,
  value: [{ key: FILTER_QUERY_PARAM_KEY.condition, value: 'un_opened' }],
};

export const WithNestedOptions = Template.bind({});
WithNestedOptions.args = {
  config: subcategoryConfig,
};

export const WithNestedOptionsAndDefaultValue = Template.bind({});
WithNestedOptionsAndDefaultValue.args = {
  config: subcategoryConfig,
  value: [
    {
      key: FILTER_QUERY_PARAM_KEY.objectType,
      value: `${SUBCATEGORIES_WITH_CHILDREN_MOCK[0].value},${SUBCATEGORIES_WITH_CHILDREN_MOCK[1].children[2].value}`,
    },
  ],
};
