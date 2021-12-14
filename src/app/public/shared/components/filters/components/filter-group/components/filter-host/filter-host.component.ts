import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FilterHostDirective } from '../../directives/filter-host.directive';
import { FilterHostConfig } from './interfaces/filter-host-config.interface';
import { FilterParameter } from '../../../../interfaces/filter-parameter.interface';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AbstractFilter } from '@public/shared/components/filters/components/abstract-filter/abstract-filter';
import { HostVisibilityService } from '@public/shared/components/filters/components/filter-group/components/filter-host/services/host-visibility.service';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';

@Component({
  selector: 'tsl-filter-host',
  templateUrl: './filter-host.component.html',
  styleUrls: ['./filter-host.component.scss'],
})
export class FilterHostComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild(FilterHostDirective, { static: true }) host: FilterHostDirective;
  @Input() hostConfig: FilterHostConfig;
  @Input() values: FilterParameter[];
  @Output() valueChange = new EventEmitter<FilterParameter[]>();
  @Output() openStateChange = new EventEmitter<boolean>();

  private visibilitySubscription = new Subscription();
  private filterSubscription: Subscription;
  private filter: AbstractFilter<unknown>;

  private drawerSeparatorVisibilitySubject = new BehaviorSubject<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public drawerSeparatorVisibility$ = this.drawerSeparatorVisibilitySubject.asObservable();

  public constructor(private visibilityService: HostVisibilityService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const { values } = changes;
    if (this.filter && values && !values.isFirstChange()) {
      this.filter.value = values.currentValue;
    }
  }

  public ngOnDestroy(): void {
    this.clearFilter(false);
    this.visibilitySubscription.unsubscribe();
    this.visibilityService.detach(this);
  }

  public ngOnInit(): void {
    this.visibilitySubscription.add(this.visibilityService.attach(this).subscribe(this.handleVisibilityChange.bind(this)));
  }

  private injectFilter(): void {
    const ref = this.host.viewContainerRef.createComponent(this.hostConfig.factory, 0);
    this.filter = ref.instance;

    this.filter.variant = this.hostConfig.variant;
    this.filter.config = this.hostConfig.filterConfig;
    this.filter.value = this.values;

    this.filterSubscription = new Subscription();
    this.filterSubscription.add(this.filter.valueChange.subscribe((value) => this.valueChange.emit(value)));
    this.filterSubscription.add(this.filter.openStateChange.subscribe((value) => this.openStateChange.emit(value)));
  }

  private clearFilter(clearValue: boolean): void {
    if (this.filter && clearValue) {
      this.filter.handleClear();
      this.filter = undefined;
    }
    this.host.viewContainerRef.clear();
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  private handleVisibilityChange(isVisible: boolean): void {
    if (isVisible) {
      this.injectFilter();
    } else {
      this.clearFilter(true);
    }

    if (this.hostConfig.variant === FILTER_VARIANT.CONTENT) {
      this.drawerSeparatorVisibilitySubject.next(isVisible);
    }
  }
}
