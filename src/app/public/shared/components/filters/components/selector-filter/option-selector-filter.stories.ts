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
import { OptionSelectorFilterComponent } from './option-selector-filter.component';
import { SelectorOptionComponent } from '../abstract-selector-filter/selector-option/selector-option.component';
import { SelectorParentOptionComponent } from '../abstract-selector-filter/selector-parent-option/selector-parent-option.component';
import { FilterOptionService } from '../../../../services/filter-option/filter-option.service';
import { MockFilterOptionService } from '@fixtures/filter-option-service.fixtures.spec';
import { SelectorFilterConfig } from '@public/shared/components/filters/components/selector-filter/interfaces/selector-filter-config.interface';

@Component({
  selector: 'tsl-filters',
  template: `
    <div>
      <h1>Bubble variant</h1>
      <div style="display: flex;">
        <div class="m-2" style="width: 100%">
          <tsl-option-selector-filter
            [variant]="${FILTER_VARIANT.BUBBLE}"
            [value]="conditionValue"
            [config]="conditionConfig"
            (valueChange)="changeCondition($event)"
            (clear)="changeCondition([])"
          >
          </tsl-option-selector-filter>
        </div>
        <div class="m-2" style="width: 100%">
          <tsl-option-selector-filter
            [variant]="${FILTER_VARIANT.BUBBLE}"
            [value]="genderValue"
            [config]="genderConfig"
            (valueChange)="changeGender($event)"
            (clear)="changeGender([])"
          >
          </tsl-option-selector-filter>
        </div>
      </div>

      <h1>Content variant</h1>
      <div style="border: 1px dashed black; background-color: white; position: relative;">
        <tsl-option-selector-filter
          [variant]="${FILTER_VARIANT.CONTENT}"
          [value]="conditionValue"
          [config]="conditionConfig"
          (valueChange)="changeCondition($event)"
          (clear)="changeCondition([])"
        >
        </tsl-option-selector-filter>
        <tsl-option-selector-filter
          [variant]="${FILTER_VARIANT.CONTENT}"
          [value]="genderValue"
          [config]="genderConfig"
          (valueChange)="changeGender($event)"
          (clear)="changeGender([])"
        >
        </tsl-option-selector-filter>
      </div>
    </div>
  `,
})
class FiltersComponent {
  public conditionValue: FilterParameter[];
  public genderValue: FilterParameter[];
  @Input() public conditionConfig: SelectorFilterConfig;
  @Input() public genderConfig: SelectorFilterConfig;

  public changeCondition(value: FilterParameter[]): void {
    this.conditionValue = value;
  }

  public changeGender(value: FilterParameter[]): void {
    this.genderValue = value;
  }
}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/OptionSelectorFilterComponent',
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule],
      providers: [
        {
          provide: FilterOptionService,
          useClass: MockFilterOptionService,
        },
      ],
      declarations: [FiltersComponent, OptionSelectorFilterComponent, SelectorOptionComponent, SelectorParentOptionComponent],
    }),
  ],
} as Meta;

const Template: Story<FiltersComponent> = (args) => ({
  props: args,
  component: FiltersComponent,
});

const conditionConfig: SelectorFilterConfig = {
  id: COMMON_CONFIGURATION_ID.CONDITION,
  hasContentPlaceholder: true,
  title: 'Condition',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'Condition',
  drawerPlaceholder: 'Select condition',
  mapKey: {
    parameterKey: 'condition',
  },
  type: FILTER_TYPES.SIMPLE_SELECTOR,
};

const genderConfig: SelectorFilterConfig = {
  id: FASHION_CONFIGURATION_ID.GENDER,
  hasContentPlaceholder: true,
  title: 'Gender',
  icon: '/assets/icons/joke.svg',
  bubblePlaceholder: 'Gender',
  drawerPlaceholder: 'Select gender',
  mapKey: {
    parameterKey: 'gender',
  },
  type: FILTER_TYPES.SIMPLE_SELECTOR,
};

export const Default = Template.bind({});
Default.args = {
  conditionConfig,
  genderConfig,
};
