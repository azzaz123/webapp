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
import { SuggesterFilterConfig } from './interfaces/suggester-filter-config.interface';
import { SuggesterFilterComponent } from './suggester-filter.component';
import { CAR_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/car-configuration-ids.enum';
import { CommonModule } from '@angular/common';
import { FilterOptionServiceModule } from '@public/shared/services/filter-option/filter-option-service.module';
import { AbstractFilterModule } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.module';
import { AbstractSelectFilterModule } from '@public/shared/components/filters/components/abstract-select-filter/abstract-select-filter.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

@Component({
  selector: 'tsl-filters',
  template: `
    <div>
      <h1>Bubble variant</h1>
      <div style="display: flex;">
        <div class="m-2" style="width: 100%">
          <tsl-suggester-filter
            [variant]="${FILTER_VARIANT.BUBBLE}"
            [value]="clothingTypeValue"
            [config]="clothingTypeConfig"
            (valueChange)="changeClothingType($event)"
          >
          </tsl-suggester-filter>
        </div>
        <div class="m-2" style="width: 100%">
          <tsl-suggester-filter
            [variant]="${FILTER_VARIANT.BUBBLE}"
            [value]="brandValue"
            [config]="brandConfig"
            (valueChange)="changeBrand($event)"
          >
          </tsl-suggester-filter>
        </div>
      </div>

      <h1>Content variant</h1>
      <div class="p-3" style="border: 1px dashed black; background-color: white; position: relative; min-height: 400px;">
        <tsl-suggester-filter
          [variant]="${FILTER_VARIANT.CONTENT}"
          [value]="clothingTypeValue"
          [config]="clothingTypeConfig"
          (valueChange)="changeClothingType($event)"
        >
        </tsl-suggester-filter>
        <div style="height: 1px; width: 100%; background-color: #90A4AE;" class="my-3"></div>
        <tsl-suggester-filter
          [variant]="${FILTER_VARIANT.CONTENT}"
          [value]="brandValue"
          [config]="brandConfig"
          (valueChange)="changeBrand($event)"
        >
        </tsl-suggester-filter>
      </div>
    </div>
  `,
})
class FiltersComponent {
  @Input() public clothingTypeValue: FilterParameter[] = [];
  @Input() public brandValue: FilterParameter[] = [];
  @Input() public clothingTypeConfig: SuggesterFilterConfig;
  @Input() public brandConfig: SuggesterFilterConfig;

  public changeClothingType(value: FilterParameter[]): void {
    this.clothingTypeValue = value;
  }

  public changeBrand(value: FilterParameter[]): void {
    this.brandValue = value;
  }
}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/SuggesterFilter',
  decorators: [
    moduleMetadata({
      imports: [
        HttpClientModule,
        CommonModule,
        FilterOptionServiceModule,
        AbstractFilterModule,
        AbstractSelectFilterModule,
        ReactiveFormsModule,
        SelectFormModule,
        SvgIconModule,
      ],
      providers: [
        {
          provide: FilterOptionService,
          useClass: MockFilterOptionService,
        },
      ],
      declarations: [FiltersComponent, SuggesterFilterComponent],
    }),
  ],
} as Meta;

const Template: Story<FiltersComponent> = (args) => ({
  props: args,
  component: FiltersComponent,
});

const clothingTypeConfig: SuggesterFilterConfig = {
  id: COMMON_CONFIGURATION_ID.CATEGORIES,
  title: 'Clothing type',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'Clothing type',
  drawerPlaceholder: 'Select clothing type',
  mapKey: {
    parameterKey: FILTER_QUERY_PARAM_KEY.objectType,
  },
  type: FILTER_TYPES.SUGGESTER,
  hasOptionsOnInit: true,
  hasContentPlaceholder: true,
  suggesterPlaceholder: 'Search for clothing type',
};

const brandConfig: SuggesterFilterConfig = {
  id: CAR_CONFIGURATION_ID.BRAND_N_MODEL,
  title: 'Brand',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'Brand',
  drawerPlaceholder: 'Select brand',
  mapKey: {
    brand: FILTER_QUERY_PARAM_KEY.brand,
    model: FILTER_QUERY_PARAM_KEY.model,
  },
  type: FILTER_TYPES.SUGGESTER,
  hasOptionsOnInit: false,
  hasContentPlaceholder: true,
  suggesterPlaceholder: 'Search for brand or model',
};

export const Default = Template.bind({});
Default.args = {
  clothingTypeConfig: clothingTypeConfig,
  brandConfig: brandConfig,
};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = {
  clothingTypeConfig: clothingTypeConfig,
  brandConfig: brandConfig,
  brandValue: [
    { key: 'brand', value: 'Audi' },
    { key: 'model', value: 'A4' },
  ],
  clothingTypeValue: [{ key: 'object_type_id', value: 'T-shirts' }],
};
