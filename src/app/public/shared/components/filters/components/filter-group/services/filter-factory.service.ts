import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { FilterParameter } from '../../../interfaces/filter-parameter.interface';
import { AbstractFilter } from '../../abstract-filter/abstract-filter';
import { FILTER_VARIANT } from '../../abstract-filter/abstract-filter.enum';
import { RangeFilterComponent } from '../../range-filter/range-filter.component';
import { ToggleFilterComponent } from '../../toggle-filter/toggle-filter.component';
import { FilterHostDirective } from '../directives/filter-host.directive';
import { FilterGroup } from '../classes/filter-group';

export const FILTERS = {
  // TODO relocate and type
  range: RangeFilterComponent,
  toggle: ToggleFilterComponent,
};

@Injectable()
export class FilterFactoryService {
  private filters: AbstractFilter<unknown>[] = [];

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}
  createFilter(config: FilterConfig<unknown>, value: FilterParameter[], variant: FILTER_VARIANT, container: FilterHostDirective) {
    const component = FILTERS[config.id];
    const componentFactory: ComponentFactory<AbstractFilter<unknown>> = this.componentFactoryResolver.resolveComponentFactory(component);

    const viewContainerRef = container.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);

    componentRef.instance.config = config;
    componentRef.instance.variant = variant;
    componentRef.instance.value = value;

    this.filters.push(componentRef.instance);
  }

  public getFilterGroup(): FilterGroup {
    return new FilterGroup(this.filters);
  }
}
