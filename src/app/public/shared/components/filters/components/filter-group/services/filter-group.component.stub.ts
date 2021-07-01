import { Component, AfterViewInit, OnDestroy, ViewChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';
import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { FilterParameter } from '../../../interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '../../abstract-filter/abstract-filter.enum';
import { FilterHostDirective } from '../directives/filter-host.directive';

@Component({
  selector: 'tsl-filter-group',
  template: '',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class FilterGroupComponentStub {
  @ViewChildren(FilterHostDirective) query: QueryList<FilterHostDirective>;
  @Input() values: FilterParameter[];
  @Input() config: FilterConfig<unknown>[] = [];
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.BUBBLE;
  @Output() valueChange = new EventEmitter<FilterParameter[]>();
  @Output() openStateChange = new EventEmitter<boolean>();
}
