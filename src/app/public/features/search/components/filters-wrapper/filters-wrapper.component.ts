import { Component, Inject } from '@angular/core';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { DrawerConfig } from '@public/shared/components/filters/interfaces/drawer-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FilterGroupConfigurationService } from '@public/shared/services/filter-group-configuration/filter-group-configuration.service';
import {
  FILTER_PARAMETER_DRAFT_STORE_TOKEN,
  FILTER_PARAMETER_STORE_TOKEN,
  FilterParameterStoreService,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FilterGroupConfiguration } from '@public/shared/services/filter-group-configuration/interfaces/filter-group-config.interface';

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
  private drawerFilterConfigurationsSubject = new BehaviorSubject<FilterGroupConfiguration>(null);
  private bubbleFilterConfigurationsSubject = new BehaviorSubject<FilterGroupConfiguration>(null);

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
    private filterGroupConfigurationService: FilterGroupConfigurationService
  ) {
    this.subscriptions.add(this.bubbleStore.parameters$.subscribe(this.handleBubbleStoreChange.bind(this)));

    this.subscriptions.add(this.drawerStore.parameters$.subscribe(this.handleDrawerStoreChange.bind(this)));
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

  private handleBubbleStoreChange(parameters: FilterParameter[]): void {
    const currentConfiguration = this.bubbleFilterConfigurationsSubject.getValue();
    const newConfiguration = this.filterGroupConfigurationService.getConfiguration(parameters);

    const isNewConfigurationFromDrawer = this.bubbleFilterConfigurationsSubject.getValue()?.id === newConfiguration.id;
    const needsNewConfiguration = !currentConfiguration || currentConfiguration.id !== newConfiguration.id;
    const needsParameterCleanup = !isNewConfigurationFromDrawer && currentConfiguration && needsNewConfiguration;

    if (needsNewConfiguration) {
      this.bubbleFilterConfigurationsSubject.next(newConfiguration);
    }

    if (needsParameterCleanup) {
      this.bubbleValuesSubject.next(newConfiguration.params);
    } else {
      this.bubbleValuesSubject.next(parameters);
    }

    if (!isNewConfigurationFromDrawer) {
      this.drawerStore.setParameters(parameters);
    }
  }

  private handleDrawerStoreChange(parameters: FilterParameter[]): void {
    const currentConfiguration = this.drawerFilterConfigurationsSubject.getValue();
    const newConfiguration = this.filterGroupConfigurationService.getConfiguration(parameters);

    const needsNewConfiguration = !currentConfiguration || currentConfiguration.id !== newConfiguration.id;
    const needsParameterCleanup = currentConfiguration && needsNewConfiguration;

    if (needsNewConfiguration) {
      this.drawerFilterConfigurationsSubject.next(newConfiguration);
    }

    if (needsParameterCleanup) {
      this.drawerValuesSubject.next(newConfiguration.params);
    } else {
      this.drawerValuesSubject.next(parameters);
    }
  }
}
