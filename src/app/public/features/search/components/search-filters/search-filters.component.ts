import { Component, EventEmitter, Output } from '@angular/core';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { CAR_CONFIGURATION_FILTERS } from '@public/shared/components/filters/core/enums/configuration/car/car-configuration-filters';
import { DrawerConfig } from '@public/shared/components/filters/interfaces/drawer-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FilterParameterDraftService } from '@public/shared/services/filter-parameter-draft/filter-parameter-draft.service';
import { FilterParameterStoreService } from '../../core/services/filter-parameter-store.service';

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
  public bubbleFiltersConfig = CAR_CONFIGURATION_FILTERS.BUBBLE;
  public drawerFiltersConfig = CAR_CONFIGURATION_FILTERS.CONTENT;

  public filterValues: FilterParameter[] = []; // TODO this usage temporary until we have the filterParamStore service

  @Output() bubbleFilterOpenStateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private filterParameterDraftService: FilterParameterDraftService,
    private filterParameterStoreService: FilterParameterStoreService
  ) {
    this.filterValues = this.filterParameterStoreService.getParameters();
  }

  public toggleDrawer(): void {
    this.drawerConfig.isOpen = !this.drawerConfig.isOpen;
  }

  public closeDrawer(): void {
    this.drawerConfig.isOpen = false;
    this.filterParameterDraftService.setParameters(this.filterValues);
    this.filterParameterStoreService.upsertParameters(this.filterValues);
  }
  public applyDrawer(): void {
    this._applyFilters();
    this.closeDrawer();
  }

  public bubbleChange(value): void {
    this.filterParameterDraftService.upsertParameters(value);
    this._applyFilters();
  }

  public drawerChange(value): void {
    this.filterParameterDraftService.upsertParameters(value);
  }

  public bubbleOpenStateChange(isOpen: boolean): void {
    this.bubbleFilterOpenStateChange.emit(isOpen);
  }

  private _applyFilters(): void {
    this.filterValues = this.filterParameterDraftService.getParameters();
    this.filterParameterStoreService.setParameters(this.filterValues);

    console.log('APPLY FILTERS', this.filterValues);
  }
}
