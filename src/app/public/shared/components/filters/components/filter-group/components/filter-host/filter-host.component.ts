import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FilterHostDirective } from '../../directives/filter-host.directive';
import { FilterHostConfig } from './interfaces/filter-host-config.interface';
import { FilterParameter } from '../../../../interfaces/filter-parameter.interface';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AbstractFilter } from '@public/shared/components/filters/components/abstract-filter/abstract-filter';
import { HostVisibilityService } from '@public/shared/components/filters/components/filter-group/components/filter-host/services/host-visibility.service';

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

  private subscriptions = new Subscription();
  private filter: AbstractFilter<unknown>;
  private visibilitySubject = new BehaviorSubject<boolean>(false);

  public isVisible$ = this.visibilitySubject.asObservable();

  public constructor(private visibilityService: HostVisibilityService) {}

  public ngOnInit(): void {
    const ref = this.host.viewContainerRef.createComponent(this.hostConfig.factory);
    this.filter = ref.instance;
    this.filter.value = this.values;
    this.filter.variant = this.hostConfig.variant;
    this.filter.config = this.hostConfig.filterConfig;

    this.subscriptions.add(this.filter.valueChange.subscribe((value) => this.valueChange.emit(value)));
    this.subscriptions.add(this.filter.openStateChange.subscribe((value) => this.openStateChange.emit(value)));
    this.subscriptions.add(this.visibilityService.attach(this).subscribe(this.handleVisibilityChange));
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const { values } = changes;
    if (values && !values.isFirstChange()) {
      this.filter.value = values.currentValue;
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.visibilityService.detach(this);
  }

  private handleVisibilityChange(isVisible: boolean): void {
    this.visibilitySubject.next(isVisible);
  }
}
