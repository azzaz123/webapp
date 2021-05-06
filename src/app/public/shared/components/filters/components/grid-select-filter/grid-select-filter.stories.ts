import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { Component, Input } from '@angular/core';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { HttpClientModule } from '@angular/common/http';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { FilterOptionService } from '../../../../services/filter-option/filter-option.service';
import { MockFilterOptionService } from '@fixtures/filter-option-service.fixtures.spec';
import { GridSelectFilterComponent } from './grid-select-filter.component';
import { GridSelectFormModule } from '@shared/form/components/grid-select/grid-select-form.module';
import { GridSelectFilterConfig } from './interfaces/grid-select-filter-config.interface';
import { CAR_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/car-configuration-ids.enum';
import { REAL_ESTATE_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/real-estate-configuration-ids.enum';
import { IsBubblePipe } from '@public/shared/components/filters/components/abstract-filter/pipes/is-bubble.pipe';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

@Component({
  selector: 'tsl-filters',
  template: `
    <div>
      <h1>Bubble variant</h1>
      <div style="display: flex;">
        <div class="m-2" style="width: 100%">
          <tsl-grid-select-filter
            [variant]="${FILTER_VARIANT.BUBBLE}"
            [value]="singleSelectValue"
            [config]="singleSelectConfig"
            (valueChange)="changeSingleSelect($event)"
          >
          </tsl-grid-select-filter>
        </div>
        <div class="m-2" style="width: 100%">
          <tsl-grid-select-filter
            [variant]="${FILTER_VARIANT.BUBBLE}"
            [value]="multiselectValue"
            [config]="multiselectConfig"
            (valueChange)="changeMultiselect($event)"
          >
          </tsl-grid-select-filter>
        </div>
      </div>

      <h1>Content variant</h1>
      <div style="border: 1px dashed black; background-color: white; position: relative; min-height: 400px;" class="p-3">
        <tsl-grid-select-filter
          [variant]="${FILTER_VARIANT.CONTENT}"
          [value]="singleSelectValue"
          [config]="singleSelectConfig"
          (valueChange)="changeSingleSelect($event)"
        >
        </tsl-grid-select-filter>
        <hr />
        <tsl-grid-select-filter
          [variant]="${FILTER_VARIANT.CONTENT}"
          [value]="multiselectValue"
          [config]="multiselectConfig"
          (valueChange)="changeMultiselect($event)"
        >
        </tsl-grid-select-filter>
      </div>
    </div>
  `,
})
class FiltersComponent {
  @Input() public singleSelectValue: FilterParameter[] = [];
  @Input() public multiselectValue: FilterParameter[] = [];
  @Input() public singleSelectConfig: GridSelectFilterConfig;
  @Input() public multiselectConfig: GridSelectFilterConfig;

  public changeSingleSelect(value: FilterParameter[]): void {
    this.singleSelectValue = value;
  }

  public changeMultiselect(value: FilterParameter[]): void {
    this.multiselectValue = value;
  }
}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/GridSelectFilter',
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule, GridSelectFormModule],
      providers: [
        {
          provide: FilterOptionService,
          useClass: MockFilterOptionService,
        },
      ],
      declarations: [FiltersComponent, GridSelectFilterComponent, IsBubblePipe],
    }),
  ],
} as Meta;

const Template: Story<FiltersComponent> = (args) => ({
  props: args,
  component: FiltersComponent,
});

const singleSelectConfig: GridSelectFilterConfig = {
  id: REAL_ESTATE_CONFIGURATION_ID.ROOMS,
  title: 'Big icons',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'Big icons',
  drawerPlaceholder: 'Big icons',
  mapKey: {
    parameterKey: FILTER_QUERY_PARAM_KEY.categoryId,
  },
  type: FILTER_TYPES.GRID,
  isMultiselect: false,
  hasBigIcons: true,
};

const multiselectConfig: GridSelectFilterConfig = {
  id: CAR_CONFIGURATION_ID.ENGINE,
  title: 'Multiselect',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'Multiselect',
  drawerPlaceholder: 'Multiselect',
  mapKey: {
    parameterKey: FILTER_QUERY_PARAM_KEY.engine,
  },
  type: FILTER_TYPES.GRID,
  isMultiselect: true,
  hasBigIcons: false,
};

export const Default = Template.bind({});
Default.args = {
  singleSelectConfig: singleSelectConfig,
  multiselectConfig: multiselectConfig,
};

export const WithDefaultValues = Template.bind({});
WithDefaultValues.args = {
  singleSelectConfig: singleSelectConfig,
  multiselectConfig: multiselectConfig,
  singleSelectValue: [{ key: 'big_icons', value: '3' }],
  multiselectValue: [{ key: 'multiselect', value: 'gasoil,gasoline' }],
};
