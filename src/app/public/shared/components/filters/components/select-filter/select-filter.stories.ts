import { moduleMetadata } from '@storybook/angular';
import { Meta } from '@storybook/angular/types-6-0';
import { Story } from '@storybook/angular/ts3.4/dist/client';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { Component, Input } from '@angular/core';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { HttpClientModule } from '@angular/common/http';
import { COMMON_CONFIGURATION_ID } from '../../core/enums/configuration-ids/common-configuration-ids.enum';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { FASHION_CONFIGURATION_ID } from '../../core/enums/configuration-ids/fashion-configuration-ids.enum';
import { SelectFilterComponent } from './select-filter.component';
import { SelectParentOptionComponent } from '../abstract-select-filter/select-parent-option/select-parent-option.component';
import { FilterOptionService } from '../../../../services/filter-option/filter-option.service';
import { MockFilterOptionService } from '@fixtures/filter-option-service.fixtures.spec';
import { SelectFilterConfig } from '@public/shared/components/filters/components/select-filter/interfaces/select-filter-config.interface';
import { SelectFormComponent } from '@shared/form/components/select/select-form.component';

@Component({
  selector: 'tsl-filters',
  template: `
    <div>
      <h1>Bubble variant</h1>
      <div style="display: flex;">
        <div class="m-2" style="width: 100%">
          <tsl-select-filter
            [variant]="${FILTER_VARIANT.BUBBLE}"
            [value]="conditionValue"
            [config]="conditionConfig"
            (valueChange)="changeCondition($event)"
            (clear)="changeCondition([])"
          >
          </tsl-select-filter>
        </div>
        <div class="m-2" style="width: 100%">
          <tsl-select-filter
            [variant]="${FILTER_VARIANT.BUBBLE}"
            [value]="genderValue"
            [config]="genderConfig"
            (valueChange)="changeGender($event)"
            (clear)="changeGender([])"
          >
          </tsl-select-filter>
        </div>
      </div>

      <h1>Content variant</h1>
      <div style="border: 1px dashed black; background-color: white; position: relative; min-height: 400px;" class="p-3">
        <tsl-select-filter
          [variant]="${FILTER_VARIANT.CONTENT}"
          [value]="conditionValue"
          [config]="conditionConfig"
          (valueChange)="changeCondition($event)"
          (clear)="changeCondition([])"
        >
        </tsl-select-filter>
        <div style="height: 1px; width: 100%; background-color: #90A4AE;" class="my-3"></div>
        <tsl-select-filter
          [variant]="${FILTER_VARIANT.CONTENT}"
          [value]="genderValue"
          [config]="genderConfig"
          (valueChange)="changeGender($event)"
          (clear)="changeGender([])"
        >
        </tsl-select-filter>
      </div>
    </div>
  `,
})
class FiltersComponent {
  public conditionValue: FilterParameter[];
  public genderValue: FilterParameter[];
  @Input() public conditionConfig: SelectFilterConfig;
  @Input() public genderConfig: SelectFilterConfig;

  public changeCondition(value: FilterParameter[]): void {
    this.conditionValue = value;
  }

  public changeGender(value: FilterParameter[]): void {
    this.genderValue = value;
  }
}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/SelectFilter',
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule],
      providers: [
        {
          provide: FilterOptionService,
          useClass: MockFilterOptionService,
        },
      ],
      declarations: [FiltersComponent, SelectFilterComponent, SelectFormComponent, SelectParentOptionComponent],
    }),
  ],
} as Meta;

const Template: Story<FiltersComponent> = (args) => ({
  props: args,
  component: FiltersComponent,
});

const conditionConfig: SelectFilterConfig = {
  id: COMMON_CONFIGURATION_ID.CONDITION,
  hasContentPlaceholder: true,
  title: 'Condition',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'Condition',
  drawerPlaceholder: 'Select condition',
  mapKey: {
    parameterKey: 'condition',
  },
  type: FILTER_TYPES.SELECT,
};

const genderConfig: SelectFilterConfig = {
  id: FASHION_CONFIGURATION_ID.GENDER,
  hasContentPlaceholder: true,
  title: 'Gender',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'Gender',
  drawerPlaceholder: 'Select gender',
  mapKey: {
    parameterKey: 'gender',
  },
  type: FILTER_TYPES.SELECT,
};

export const Default = Template.bind({});
Default.args = {
  conditionConfig,
  genderConfig,
};

export const WithIcons = Template.bind({});
WithIcons.args = {
  conditionConfig: {
    ...conditionConfig,
    id: 'with_icon',
  },
  genderConfig: {
    ...genderConfig,
    id: 'with_icon',
  },
};
