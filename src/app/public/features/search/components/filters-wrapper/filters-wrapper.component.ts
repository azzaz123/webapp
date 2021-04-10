import { Component, EventEmitter, Output } from '@angular/core';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { DrawerConfig } from '@public/shared/components/filters/interfaces/drawer-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FilterConfigurationService } from '@public/shared/services/filter-configuration/filter-configuration.service';
import { FilterConfigurations } from '@public/shared/services/filter-configuration/interfaces/filter-configurations.interface';
import { FilterParameterDraftService } from '@public/shared/services/filter-parameter-draft/filter-parameter-draft.service';
import { FilterParameterStoreService } from '../../core/services/filter-parameter-store.service';

@Component({
  selector: 'tsl-filters-wrapper',
  templateUrl: './filters-wrapper.component.html',
  styleUrls: ['./filters-wrapper.component.scss'],
})
export class FiltersWrapperComponent {
  public readonly FILTER_VARIANT = FILTER_VARIANT;
  public drawerConfig: DrawerConfig = {
    isOpen: false,
    offsetTop: 66,
    hasApply: true,
  };
  public activeFiltersCount = 0;
  public filterConfigurations: FilterConfigurations;

  public filterValues: FilterParameter[] = [];

  @Output() bubbleFilterOpenStateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private filterParameterDraftService: FilterParameterDraftService,
    private filterParameterStoreService: FilterParameterStoreService,
    private filterConfigurationService: FilterConfigurationService
  ) {
    this.getFilterValues();

    this.filterParameterStoreService.parameters$.subscribe((filterValues: FilterParameter[]) => {
      console.log('filters changed', filterValues);
      this.filterConfigurations = this.filterConfigurationService.getConfiguration(filterValues);
      console.log('filterConfigurations!', this.filterConfigurations);
    });
  }

  public toggleDrawer(): void {
    this.drawerConfig.isOpen = !this.drawerConfig.isOpen;
  }

  public closeDrawer(): void {
    this.drawerConfig.isOpen = false;
    this.filterValues = [...this.filterValues];
    this.filterParameterDraftService.setParameters(this.filterValues);
  }
  public applyDrawer(): void {
    this.applyFilters();
    this.closeDrawer();
  }

  public bubbleChange(value): void {
    this.filterParameterDraftService.upsertParameters(value);
    this.applyFilters();
  }

  public drawerChange(value): void {
    this.filterParameterDraftService.upsertParameters(value);
  }

  public bubbleOpenStateChange(isOpen: boolean): void {
    this.bubbleFilterOpenStateChange.emit(isOpen);
    if (!isOpen) {
      this.filterValues = [...this.filterValues];
    }
  }

  public bubbleClear(valuesToRemove: FilterParameter[]): void {
    this.filterParameterDraftService.removeParameters(valuesToRemove);
    this.applyFilters();
  }

  public drawerClear(valuesToRemove: FilterParameter[]): void {
    this.filterParameterDraftService.removeParameters(valuesToRemove);
  }

  private applyFilters(): void {
    this.filterValues = this.filterParameterDraftService.getParameters();
    this.filterParameterStoreService.setParameters(this.filterValues);
  }

  private getFilterValues(): void {
    this.filterValues = this.filterParameterStoreService.getParameters();
  }
}
