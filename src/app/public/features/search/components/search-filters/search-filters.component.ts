import { Component, EventEmitter, Output } from '@angular/core';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { DrawerConfig } from '@public/shared/components/filters/interfaces/drawer-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FilterConfigurationService } from '@public/shared/services/filter-configuration/filter-configuration.service';
import { FilterConfigurations } from '@public/shared/services/filter-configuration/interfaces/filter-group-config.interface';

@Component({
  selector: 'tsl-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss'],
})
export class SearchFiltersComponent {
  public readonly FILTER_VARIANT = FILTER_VARIANT;
  public drawerConfig: DrawerConfig = {
    isOpen: false,
    offsetTop: 66,
    hasApply: true,
  };
  public activeFiltersCount = 0;
  public filterValues: FilterParameter[] = [];
  public filterConfigurations: FilterConfigurations;

  @Output() bubbleFilterOpenStateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private filterConfigurationService: FilterConfigurationService) {
    this.filterConfigurations = this.filterConfigurationService.getConfiguration([]);
    console.log('AQUI!', this.filterConfigurations);
  }

  public toggleDrawer(): void {
    this.drawerConfig.isOpen = !this.drawerConfig.isOpen;
  }

  public closeDrawer(): void {
    this.drawerConfig.isOpen = false;
  }

  public bubbleChange(value): void {
    console.log('bubbleChange', value);
  }

  public drawerChange(value): void {
    console.log('drawerChange', value);
  }

  public bubbleOpenStateChange(isOpen: boolean): void {
    this.bubbleFilterOpenStateChange.emit(isOpen);
  }
}
