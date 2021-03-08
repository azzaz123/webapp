import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FilterConfig } from '../../interfaces/filter-config.interface';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { FilterHostDirective } from './directives/filter-host.directive';
import { FilterFactoryService } from './services/filter-factory.service';
import { FilterGroup } from './classes/filter-group';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tsl-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.scss'],
})
export class FilterGroupComponent implements AfterViewInit, OnDestroy {
  @ViewChildren(FilterHostDirective) query: QueryList<FilterHostDirective>;
  @Input() initialValues: FilterParameter[];
  @Input() config: FilterConfig<unknown>[] = [];
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.BUBBLE;
  @Output() valueChange = new EventEmitter<FilterParameter[]>();

  readonly FILTER_VARIANT = FILTER_VARIANT;

  private filterGroup: FilterGroup;
  private filterGroupSubscriptions: Subscription[];

  constructor(private filterFactory: FilterFactoryService) {}

  ngAfterViewInit(): void {
    this.insertFilters();
    this.filterGroup = this.filterFactory.filterGroup;

    this.filterGroup.valueChange().subscribe((value: FilterParameter[]) => {
      this.valueChange.emit(value);
    });
  }

  private insertFilters(): void {
    this.filterFactory.insertFilters(this.config, this.initialValues, this.variant, this.query);
  }

  ngOnDestroy(): void {
    this.filterGroupSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
