import { moduleMetadata } from '@storybook/angular';
import { Meta } from '@storybook/angular/types-6-0';
import { Story } from '@storybook/angular/ts3.4/dist/client';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { Component, Input } from '@angular/core';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { HttpClientModule } from '@angular/common/http';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { FilterOptionService } from '../../../../services/filter-option/filter-option.service';
import { MockFilterOptionService } from '@fixtures/filter-option-service.fixtures.spec';
import { IconGridFilterComponent } from './icon-grid-filter.component';
import { IconGridCheckFormModule } from '@shared/form/components/icon-grid-check/icon-grid-check-form.module';
import { IconGridFilterConfig } from './interfaces/icon-grid-filter-config.interface';
import { CAR_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/car-configuration-ids';
import { REAL_ESTATE_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/real-estate-configuration-ids.enum';

@Component({
  selector: 'tsl-filters',
  template: `
    <div>
      <h1>Bubble variant</h1>
      <div style="display: flex;">
        <div class="m-2" style="width: 100%">
          <tsl-icon-grid-filter
            [variant]="${FILTER_VARIANT.BUBBLE}"
            [value]="monoselectValue"
            [config]="monoselectConfig"
            (valueChange)="changeMonoselect($event)"
            (clear)="changeMonoselect([])"
          >
          </tsl-icon-grid-filter>
        </div>
        <div class="m-2" style="width: 100%">
          <tsl-icon-grid-filter
            [variant]="${FILTER_VARIANT.BUBBLE}"
            [value]="multiselectValue"
            [config]="multiselectConfig"
            (valueChange)="changeMultiselect($event)"
            (clear)="changeMultiselect([])"
          >
          </tsl-icon-grid-filter>
        </div>
      </div>

      <h1>Content variant</h1>
      <div style="border: 1px dashed black; background-color: white; position: relative; min-height: 400px;" class="p-3">
        <tsl-icon-grid-filter
          [variant]="${FILTER_VARIANT.CONTENT}"
          [value]="monoselectValue"
          [config]="monoselectConfig"
          (valueChange)="changeMonoselect($event)"
          (clear)="changeMonoselect([])"
        >
        </tsl-icon-grid-filter>
        <hr />
        <tsl-icon-grid-filter
          [variant]="${FILTER_VARIANT.CONTENT}"
          [value]="multiselectValue"
          [config]="multiselectConfig"
          (valueChange)="changeMultiselect($event)"
          (clear)="changeMultiselect([])"
        >
        </tsl-icon-grid-filter>
      </div>
    </div>
  `,
})
class FiltersComponent {
  @Input() public monoselectValue: FilterParameter[];
  @Input() public multiselectValue: FilterParameter[];
  @Input() public monoselectConfig: IconGridFilterConfig;
  @Input() public multiselectConfig: IconGridFilterConfig;

  public changeMonoselect(value: FilterParameter[]): void {
    this.monoselectValue = value;
  }

  public changeMultiselect(value: FilterParameter[]): void {
    this.multiselectValue = value;
  }
}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/IconGridFilter',
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule, IconGridCheckFormModule],
      providers: [
        {
          provide: FilterOptionService,
          useClass: MockFilterOptionService,
        },
      ],
      declarations: [FiltersComponent, IconGridFilterComponent],
    }),
  ],
} as Meta;

const Template: Story<FiltersComponent> = (args) => ({
  props: args,
  component: FiltersComponent,
});

const monoselectConfig: IconGridFilterConfig = {
  id: REAL_ESTATE_CONFIGURATION_ID.ROOMS,
  title: 'Big icons',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'Big icons',
  drawerPlaceholder: 'Big icons',
  mapKey: {
    parameterKey: 'big_icons',
  },
  type: FILTER_TYPES.ICON,
  isMultiselect: false,
  hasBigIcons: true,
};

const multiselectConfig: IconGridFilterConfig = {
  id: CAR_CONFIGURATION_ID.ENGINE,
  title: 'Multiselect',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'Multiselect',
  drawerPlaceholder: 'Multiselect',
  mapKey: {
    parameterKey: 'multiselect',
  },
  type: FILTER_TYPES.ICON,
  isMultiselect: true,
  hasBigIcons: false,
};

export const Default = Template.bind({});
Default.args = {
  monoselectConfig: monoselectConfig,
  multiselectConfig: multiselectConfig,
};

export const WithDefaultValues = Template.bind({});
WithDefaultValues.args = {
  monoselectConfig: monoselectConfig,
  multiselectConfig: multiselectConfig,
  monoselectValue: [{ key: 'big_icons', value: '3' }],
  multiselectValue: [{ key: 'multiselect', value: 'gasoil,gasoline' }],
};
