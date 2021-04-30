import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FilterParameter } from '../../../interfaces/filter-parameter.interface';
import { AbstractFilter } from '../../abstract-filter/abstract-filter';
import { LocationFilterConfig } from '../interfaces/location-filter-config.interface';
import { LocationFilterParams } from '../interfaces/location-filter-params.interface';

@Component({
  selector: 'tsl-location-filter',
  templateUrl: './location-filter.component.html',
  styleUrls: ['./location-filter.component.scss'],
})
export class LocationFilterComponent extends AbstractFilter<LocationFilterParams> implements OnInit, OnDestroy {
  @Input() config: LocationFilterConfig;

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy(): void {}

  public onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void {}
}
