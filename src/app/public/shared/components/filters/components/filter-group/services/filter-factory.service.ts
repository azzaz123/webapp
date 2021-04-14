import { ComponentFactory, ComponentFactoryResolver, Injectable, QueryList } from '@angular/core';
import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { FilterParameter } from '../../../interfaces/filter-parameter.interface';
import { AbstractFilter } from '../../abstract-filter/abstract-filter';
import { FILTER_VARIANT } from '../../abstract-filter/abstract-filter.enum';
import { FilterHostDirective } from '../directives/filter-host.directive';
import { FilterGroup } from '../classes/filter-group';
import { FILTER_TYPE_COMPONENT } from '../constants/filter-type-component.constant';

@Injectable()
export class FilterFactoryService {
  private filters: AbstractFilter<unknown>[] = [];

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public insertFilters(
    filterConfigs: FilterConfig<unknown>[],
    values: FilterParameter[],
    variant: FILTER_VARIANT,
    queryList: QueryList<FilterHostDirective>
  ): void {
    filterConfigs.forEach((filterConfig: FilterConfig<unknown>, index: number) => {
      this.createFilter(filterConfig, this.getValueByFilterConfig(filterConfig, values), variant, queryList.toArray()[index]);
    });
  }

  public getFilterGroup(variant: FILTER_VARIANT): FilterGroup {
    return new FilterGroup(this.filters.filter((filter) => filter.variant === variant));
  }

  private createFilter(
    config: FilterConfig<unknown>,
    value: FilterParameter[],
    variant: FILTER_VARIANT,
    container: FilterHostDirective
  ): void {
    const component = FILTER_TYPE_COMPONENT[config.type];
    const componentFactory: ComponentFactory<AbstractFilter<unknown>> = this.componentFactoryResolver.resolveComponentFactory(component);

    const viewContainerRef = container.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);

    componentRef.instance.config = config;
    componentRef.instance.variant = variant;
    componentRef.instance.value = value;

    this.filters.push(componentRef.instance);
  }

  private getValueByFilterConfig(filterConfig: FilterConfig<unknown>, values: FilterParameter[]): FilterParameter[] {
    if (values) {
      const filterValue: FilterParameter[] = [];
      Object.keys(filterConfig.mapKey).forEach((mapKey: string) => {
        const value = values.find((parameter: FilterParameter) => parameter.key === filterConfig.mapKey[mapKey])?.value;
        if (value) {
          filterValue.push({ key: filterConfig.mapKey[mapKey], value: value });
        }
      });

      return filterValue;
    }

    return [];
  }
}
