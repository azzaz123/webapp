import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
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

@Component({
  selector: 'tsl-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.scss'],
})
export class FilterGroupComponent implements OnInit, OnChanges {
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

  public ngOnInit(): void {
    this.updateHostConfigs();
  }

  public ngOnChanges(changes: SimpleChanges) {
    // TODO: React to changes on configuration
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
}
