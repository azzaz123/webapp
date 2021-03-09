import { Component } from '@angular/core';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { CAR_CONFIGURATION_FILTERS } from '@public/shared/components/filters/core/enums/configuration/car/car-configuration-filters';

@Component({
  selector: 'tsl-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss'],
})
export class SearchFiltersComponent {
  public readonly FILTER_VARIANT = FILTER_VARIANT;
  public drawer = {
    isOpen: false,
    offsetTop: 66,
    hasApply: true,
  };

  public activeFiltersCount = 0;

  public bubbleFiltersConfig = CAR_CONFIGURATION_FILTERS.BUBBLE;
  public drawerFiltersConfig = CAR_CONFIGURATION_FILTERS.CONTENT;

  constructor() {}

  public toggleDrawer(): void {
    this.drawer.isOpen = !this.drawer.isOpen;
  }

  public closeDrawer(): void {
    this.drawer.isOpen = false;
  }
}
