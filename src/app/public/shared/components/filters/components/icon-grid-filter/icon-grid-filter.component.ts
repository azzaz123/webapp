import { Component, Input } from '@angular/core';
import { AbstractFilter } from '../abstract-filter/abstract-filter';
import { IconGridFilterParams } from './interfaces/icon-grid-filter-params.interface';
import { IconGridFilterConfig } from './interfaces/icon-grid-filter-config.interface';

@Component({
  selector: 'tsl-icon-grid-filter',
  templateUrl: './icon-grid-filter.component.html',
  styleUrls: ['./icon-grid-filter.component.scss'],
})
export class IconGridFilterComponent extends AbstractFilter<IconGridFilterParams> {
  @Input() config: IconGridFilterConfig;
}
