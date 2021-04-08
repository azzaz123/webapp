import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { ToggleFormModule } from '@shared/form/components/toggle/toggle-form.module';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CookieService } from 'ngx-cookie';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { ToggleFilterConfig } from './interfaces/toggle-filter-config.interface';
import { ToggleFilterComponent } from './toggle-filter.component';

@Component({
  selector: 'tsl-filters',
  template: `
    <div>
      <h1>Bubble variant</h1>
      <tsl-toggle-filter [variant]="${FILTER_VARIANT.BUBBLE}" [value]="value" [config]="config" (valueChange)="changeBubble($event)">
      </tsl-toggle-filter>
      <h1>Content variant</h1>
      <div style="border: 1px dashed black; background-color: white" class="p-3">
        <tsl-toggle-filter [variant]="${FILTER_VARIANT.CONTENT}" [value]="value" [config]="config" (valueChange)="changeContent($event)">
        </tsl-toggle-filter>
      </div>
    </div>
  `,
})
class FiltersComponent {
  public value: FilterParameter[];
  public config: ToggleFilterConfig;

  changeBubble(value: FilterParameter[]): void {
    this.value = value;
  }

  changeContent(value: FilterParameter[]): void {
    this.value = value;
  }
}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/ToggleFilterComponent',
  decorators: [
    moduleMetadata({
      declarations: [ToggleFilterComponent],
      imports: [CommonModule, AbstractFilterModule, ToggleFormModule, HttpClientModule],
      providers: [{ provide: CookieService, useValue: MockCookieService }, DeviceDetectorService],
    }),
  ],
} as Meta;

const Template: Story<FiltersComponent> = (args: FiltersComponent) => ({
  component: FiltersComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  config: {
    type: FILTER_TYPES.TOGGLE,
    mapKey: {
      key: 'warranty',
    },
    title: 'Warranty',
    icon: '/assets/icons/joke.svg',
    bubblePlaceholder: 'Has warranty',
  },
};
