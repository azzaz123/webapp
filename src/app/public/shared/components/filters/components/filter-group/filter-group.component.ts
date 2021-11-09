import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { FilterConfig } from '../../interfaces/filter-config.interface';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { FilterHostDirective } from './directives/filter-host.directive';
import { BehaviorSubject } from 'rxjs';
import { FilterHostConfig } from './components/filter-host/interfaces/filter-host-config.interface';
import { FILTER_TYPE_COMPONENT } from './constants/filter-type-component.constant';
import { FILTER_IDS_TO_REFRESH_VALUES } from '@public/shared/services/filter-option/configurations/filter-ids-to-refresh-values';

@Component({
  selector: 'tsl-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.scss'],
})
export class FilterGroupComponent implements OnChanges {
  @ViewChildren(FilterHostDirective) filterHosts: QueryList<FilterHostDirective>;
  @Input() values: FilterParameter[];
  @Input() config: FilterConfig<unknown>[] = [];
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.BUBBLE;
  @Output() valueChange = new EventEmitter<FilterParameter[]>();
  @Output() openStateChange = new EventEmitter<boolean>();

  readonly FILTER_VARIANT = FILTER_VARIANT;

  private hostConfigsSubject = new BehaviorSubject<FilterHostConfig[]>([]);

  public filterConfigs$ = this.hostConfigsSubject.asObservable();

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public ngOnChanges(changes: SimpleChanges) {
    const { config } = changes;

    if (config && (this.hasConfigChanged(config.previousValue, config.currentValue) || this.needsToRefreshValues(config.currentValue))) {
      this.updateHostConfigs();
    }
  }

  private updateHostConfigs(): void {
    const configs = this.config.map((filterConfig: FilterConfig<unknown>) => {
      const componentClass = FILTER_TYPE_COMPONENT[filterConfig.type];
      return {
        factory: this.componentFactoryResolver.resolveComponentFactory(componentClass),
        filterConfig,
        variant: this.variant,
      };
    });

    this.hostConfigsSubject.next(configs);
  }

  private hasConfigChanged(previousConfig: FilterConfig<unknown>[], currentConfig: FilterConfig<unknown>[]): boolean {
    if (!previousConfig || previousConfig.length !== currentConfig.length) {
      return true;
    }

    const previousIds = previousConfig.map((prev) => prev.id);
    const currentIds = currentConfig.map((curr) => curr.id);

    return !currentIds.every((id) => previousIds.includes(id));
  }

  private needsToRefreshValues(config: FilterConfig<unknown>[]): boolean {
    return !!config.find((config: FilterConfig<unknown>) => FILTER_IDS_TO_REFRESH_VALUES.includes(config.id));
  }
}
