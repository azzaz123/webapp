import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationFilterComponent } from './location-filter/location-filter.component';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';

@NgModule({
  declarations: [LocationFilterComponent],
  imports: [AbstractFilterModule, CommonModule],
})
export class LocationFilterModule {}
