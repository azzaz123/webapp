import { Component, EventEmitter, Output } from '@angular/core';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { DrawerConfig } from '@public/shared/components/filters/interfaces/drawer-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FilterConfigurationService } from '@public/shared/services/filter-configuration/filter-configuration.service';
import { FilterConfigurations } from '@public/shared/services/filter-configuration/interfaces/filter-configurations.interface';
import { FilterParameterDraftService } from '@public/shared/services/filter-parameter-draft/filter-parameter-draft.service';
import { FilterParameterStoreService } from '../../core/services/filter-parameter-store.service';
import { BehaviorSubject, Observable } from 'rxjs';

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
  public scrollOffset = 0;
  private isBubbleOpenSubject = new BehaviorSubject<boolean>(false);

  @Output() bubbleFilterOpenStateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public get isBubbleOpen$(): Observable<boolean> {
    return this.isBubbleOpenSubject.asObservable();
  }

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
    this.filterParameterDraftService.setParameters([...this.filterValues]);
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
    if (this.drawerConfig.isOpen && isOpen) {
      this.drawerConfig.isOpen = false;
    }

    this.isBubbleOpenSubject.next(isOpen);
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
