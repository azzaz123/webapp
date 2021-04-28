import { Component, Inject } from '@angular/core';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { DrawerConfig } from '@public/shared/components/filters/interfaces/drawer-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FilterWrapperConfigurationService } from '@public/shared/services/filter-wrapper-configuration/filter-wrapper-configuration.service';
import {
  FILTER_PARAMETER_DRAFT_STORE_TOKEN,
  FILTER_PARAMETER_STORE_TOKEN,
  FilterParameterStoreService,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { FilterWrapperConfiguration } from '@public/shared/services/filter-wrapper-configuration/interfaces/filter-group-config.interface';
import { FILTER_GROUP_ID } from '@public/shared/services/filter-wrapper-configuration/enum/filter-group-id.enum';
import { DEFAULT_FILTER_WRAPPER_CONFIG } from '@public/shared/services/filter-wrapper-configuration/data/filter-group-config';

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
  private currentDrawerConfigurationId = DEFAULT_FILTER_WRAPPER_CONFIG.id;
  private currentBubbleConfigurationId = DEFAULT_FILTER_WRAPPER_CONFIG.id;
  private drawerFilterConfigurationsSubject = new Subject<FilterWrapperConfiguration>();
  private bubbleFilterConfigurationsSubject = new Subject<FilterWrapperConfiguration>();

  public scrollOffset = 0;
  private drawerValuesSubject = new BehaviorSubject<FilterParameter[]>([]);
  private bubbleValuesSubject = new BehaviorSubject<FilterParameter[]>([]);
  private openedBubbleSubject = new BehaviorSubject<boolean>(false);
  private isDrawerContentScrollableSubject = new BehaviorSubject<boolean>(false);
  private subscriptions = new Subscription();

  public drawerFilterConfigurations$ = this.drawerFilterConfigurationsSubject.asObservable();
  public bubbleFilterConfigurations$ = this.bubbleFilterConfigurationsSubject.asObservable();
  public openedBubble$ = this.openedBubbleSubject.asObservable();
  public bubbleValues$ = this.bubbleValuesSubject.asObservable();
  public drawerValues$ = this.drawerValuesSubject.asObservable();
  public isDrawerContentScrollable$ = this.isDrawerContentScrollableSubject.asObservable();

  constructor(
    @Inject(FILTER_PARAMETER_DRAFT_STORE_TOKEN) private drawerStore: FilterParameterStoreService,
    @Inject(FILTER_PARAMETER_STORE_TOKEN) private bubbleStore: FilterParameterStoreService,
    private filterWrapperConfigurationService: FilterWrapperConfigurationService
  ) {
    this.subscriptions.add(
      this.bubbleStore.parameters$.subscribe((filterValues: FilterParameter[]) => {
        const hasConfigurationChanged = this.handleConfigurationParametersChange(FILTER_VARIANT.BUBBLE, filterValues);

        if (!hasConfigurationChanged) {
          this.bubbleValuesSubject.next(filterValues);
          this.drawerStore.setParameters(filterValues);
        }
      })
    );

    this.subscriptions.add(
      this.drawerStore.parameters$.subscribe((filterValues: FilterParameter[]) => {
        this.handleConfigurationParametersChange(FILTER_VARIANT.CONTENT, filterValues);

        this.drawerValuesSubject.next(filterValues);
      })
    );

    this.subscriptions.add(
      this.bubbleFilterConfigurationsSubject.subscribe((config) => {
        if (this.shouldBubbleConfigCleanParams()) {
          this.bubbleStore.setParameters(config.params);
        } else {
          this.bubbleStore.setParameters(this.drawerStore.getParameters());
        }
      })
    );
    this.subscriptions.add(
      this.drawerFilterConfigurationsSubject.subscribe((config) => {
        this.drawerStore.setParameters(config.params);
      })
    );
  }

  public toggleDrawer(): void {
    if (this.drawerConfig.isOpen) {
      this.closeDrawer();
    } else {
      this.drawerConfig.isOpen = true;
    }
  }

  public closeDrawer(): void {
    this.drawerConfig.isOpen = false;
    this.drawerStore.setParameters(this.bubbleStore.getParameters());
  }
  public applyDrawer(): void {
    this.bubbleStore.setParameters(this.drawerStore.getParameters());
    this.drawerConfig.isOpen = false;
  }

  public bubbleChange(values: FilterParameter[]): void {
    this.bubbleStore.upsertParameters(values);
  }

  public drawerChange(values: FilterParameter[]): void {
    this.drawerStore.upsertParameters(values);
  }

  public bubbleOpenStateChange(isOpen: boolean): void {
    if (isOpen && this.drawerConfig.isOpen) {
      this.closeDrawer();
    }
    this.openedBubbleSubject.next(isOpen);
  }

  public drawerOpenStateChange(isOpen: boolean): void {
    this.isDrawerContentScrollableSubject.next(isOpen);
  }

  private handleConfigurationParametersChange(variant: FILTER_VARIANT, filterValues: FilterParameter[]): boolean {
    const wrapperConfiguration = this.filterWrapperConfigurationService.getConfiguration(filterValues);

    if (this.getConfigurationId(variant) !== wrapperConfiguration.id) {
      this.setFilterConfiguration(variant, wrapperConfiguration);
      return true;
    }

    return false;
  }

  private shouldBubbleConfigCleanParams(): boolean {
    return this.currentBubbleConfigurationId !== this.currentDrawerConfigurationId;
  }

  private getConfigurationId(variant: FILTER_VARIANT): FILTER_GROUP_ID {
    return variant === FILTER_VARIANT.BUBBLE ? this.currentBubbleConfigurationId : this.currentDrawerConfigurationId;
  }

  private setFilterConfiguration(variant: FILTER_VARIANT, newConfiguration: FilterWrapperConfiguration): void {
    if (variant === FILTER_VARIANT.BUBBLE) {
      this.currentBubbleConfigurationId = newConfiguration.id;
      this.bubbleFilterConfigurationsSubject.next(newConfiguration);
    } else {
      this.currentDrawerConfigurationId = newConfiguration.id;
      this.drawerFilterConfigurationsSubject.next(newConfiguration);
    }
  }
}
