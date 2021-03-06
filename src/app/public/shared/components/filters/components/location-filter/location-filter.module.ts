import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationFilterComponent } from './location-filter/location-filter.component';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { SliderFormModule } from '@shared/form/components/slider/slider-form.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { LocationFilterService } from './services/location-filter.service';
import { AbstractSelectFilterModule } from '@public/shared/components/filters/components/abstract-select-filter/abstract-select-filter.module';

@NgModule({
  declarations: [LocationFilterComponent],
  imports: [
    AbstractFilterModule,
    CommonModule,
    SliderFormModule,
    NgbTypeaheadModule,
    FormsModule,
    ReactiveFormsModule,
    SvgIconModule,
    AbstractSelectFilterModule,
  ],
  providers: [LocationFilterService],
})
export class LocationFilterModule {}
