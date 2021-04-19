import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { DrawerConfig } from '@public/shared/components/filters/interfaces/drawer-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FilterWrapperConfigurationService } from '@public/shared/services/filter-wrapper-configuration/filter-wrapper-configuration.service';
import {
  FILTER_PARAMETER_DRAFT_STORE_TOKEN,
  FILTER_PARAMETER_STORE_TOKEN,
  FilterParameterStoreService,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FilterWrapperConfiguration } from '@public/shared/services/filter-wrapper-configuration/interfaces/filter-group-config.interface';

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
  private drawerFilterConfigurationsSubject = new BehaviorSubject<FilterWrapperConfiguration>(null);
  private bubbleFilterConfigurationsSubject = new BehaviorSubject<FilterWrapperConfiguration>(null);

  public scrollOffset = 0;
  private drawerValuesSubject = new BehaviorSubject<FilterParameter[]>([]);
  private bubbleValuesSubject = new BehaviorSubject<FilterParameter[]>([]);
  private openBubbleCountSubject = new BehaviorSubject<number>(0);
  private isDrawerContentScrollableSubject = new BehaviorSubject<boolean>(false);
  private subscriptions = new Subscription();

  public drawerFilterConfigurations$ = this.drawerFilterConfigurationsSubject.asObservable();
  public bubbleFilterConfigurations$ = this.bubbleFilterConfigurationsSubject.asObservable();
  public openBubbleCount$ = this.openBubbleCountSubject.asObservable();
  public bubbleValues$ = this.bubbleValuesSubject.asObservable();
  public drawerValues$ = this.drawerValuesSubject.asObservable();
  public isDrawerContentScrollable$ = this.isDrawerContentScrollableSubject.asObservable();

  @Output() bubbleFilterOpenStateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    @Inject(FILTER_PARAMETER_DRAFT_STORE_TOKEN) private drawerStore: FilterParameterStoreService,
    @Inject(FILTER_PARAMETER_STORE_TOKEN) private bubbleStore: FilterParameterStoreService,
    private filterConfigurationService: FilterWrapperConfigurationService
  ) {
    this.subscriptions.add(
      this.bubbleStore.parameters$.subscribe((filterValues: FilterParameter[]) => {
        this.bubbleFilterConfigurationsSubject.next(this.filterConfigurationService.getConfiguration(FILTER_VARIANT.BUBBLE, filterValues));
        this.bubbleValuesSubject.next(filterValues);
        this.drawerStore.setParameters(filterValues);
      })
    );

    this.subscriptions.add(
      this.drawerStore.parameters$.subscribe((filterValues: FilterParameter[]) => {
        this.drawerFilterConfigurationsSubject.next(this.filterConfigurationService.getConfiguration(FILTER_VARIANT.CONTENT, filterValues));
        this.drawerValuesSubject.next(filterValues);
      })
    );
  }

  public toggleDrawer(): void {
    this.drawerConfig.isOpen = !this.drawerConfig.isOpen;
  }

  public closeDrawer(): void {
    this.drawerConfig.isOpen = false;
    this.drawerStore.setParameters(this.bubbleStore.getParameters());
  }
  public applyDrawer(): void {
    this.bubbleStore.upsertParameters(this.drawerStore.getParameters());
    this.closeDrawer();
  }

  public bubbleChange(values: FilterParameter[]): void {
    this.bubbleStore.upsertParameters(values);
  }

  public drawerChange(values: FilterParameter[]): void {
    this.drawerStore.upsertParameters(values);
  }

  public bubbleOpenStateChange(isOpen: boolean): void {
    this.bubbleFilterOpenStateChange.emit(isOpen);
    if (this.drawerConfig.isOpen && isOpen) {
      this.drawerConfig.isOpen = false;
    }

    const count = this.openBubbleCountSubject.getValue();
    this.openBubbleCountSubject.next(isOpen ? count + 1 : count - 1);
  }

  public drawerOpenStateChange(isOpen: boolean): void {
    this.isDrawerContentScrollableSubject.next(isOpen);
  }
}
