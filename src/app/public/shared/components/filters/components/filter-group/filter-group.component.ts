import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FilterConfig } from '../../interfaces/filter-config.interface';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { FilterHostDirective } from './directives/filter-host.directive';
import { FilterFactoryService } from './services/filter-factory.service';
import { FilterGroup } from './services/filter-group.service';

@Component({
  selector: 'tsl-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.scss'],
})
export class FilterGroupComponent implements AfterViewInit {
  @ViewChildren(FilterHostDirective) query: QueryList<FilterHostDirective>;
  @Input() initialValues: FilterParameter[];
  @Input() config: FilterConfig<unknown>[] = [];
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.BUBBLE;
  @Output() valueChange = new EventEmitter<any>();

  readonly FILTER_VARIANT = FILTER_VARIANT;

  private filterGroup: FilterGroup;

  constructor(private filterFactory: FilterFactoryService) {}

  ngAfterViewInit(): void {
    this.insertFilters();
    this.filterGroup = this.filterFactory.getFilterGroup();

    this.filterGroup.valueChange.subscribe((value: FilterParameter[]) => {
      this.valueChange.emit(value);
    });
  }

  private insertFilters() {
    this.config.forEach((filterConfig: FilterConfig<unknown>, index: number) => {
      this.filterFactory.createFilter(
        filterConfig,
        this.getInitialValueByFilterConfig(filterConfig),
        this.variant,
        this.query.toArray()[index]
      );
    });
  }

  private getInitialValueByFilterConfig(filterConfig: FilterConfig<unknown>): FilterParameter[] {
    const filterValue: FilterParameter[] = [];
    Object.keys(filterConfig.mapKey).forEach((mapKey: string) => {
      const value = this.initialValues.find((parameter: FilterParameter) => parameter.key === filterConfig.mapKey[mapKey])?.value;
      if (value) {
        filterValue.push({ key: filterConfig.mapKey[mapKey], value: value });
      }
    });

    return filterValue;
  }
}
