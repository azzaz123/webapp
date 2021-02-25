import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { SliderFormModule } from '@shared/form/components/slider/slider-form.module';
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { CookieService } from 'ngx-cookie';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { FilterGroupComponent } from './ filter-group.component';

@Component({
  selector: 'tsl-filters',
  template: ` <tsl-filter-group> </tsl-filter-group> `,
})
class FiltersComponent {}

export default {
  title: 'Webapp/Public/Shared/Components/Filters/FilterGroup',
  decorators: [
    moduleMetadata({
      declarations: [FilterGroupComponent],
      imports: [CommonModule, AbstractFilterModule, SliderFormModule, ReactiveFormsModule, HttpClientModule],
      providers: [{ provide: CookieService, useValue: MockCookieService }],
    }),
  ],
} as Meta;

const Template: Story<FiltersComponent> = (args: FiltersComponent) => ({
  component: FiltersComponent,
  props: args,
});

export const Default = Template.bind({});
