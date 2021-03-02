import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FilterConfig } from '../../interfaces/filter-config.interface';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { FilterHostDirective } from './directives/filter-host.directive';
import { FilterFactoryService } from './services/filter-factory.service';

@Component({
  selector: 'tsl-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.scss'],
})
export class FilterGroupComponent implements AfterViewInit {
  @ViewChildren(FilterHostDirective) query: QueryList<FilterHostDirective>;
  @Input() initialValues: FilterParameter[];
  @Input() config: FilterConfig<any>[] = [];
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.BUBBLE;
  // TODO check naming
  @Output() childOpenStateChange = new EventEmitter<any>();
  @Output() valueChange = new EventEmitter<any>();

  readonly FILTER_VARIANT = FILTER_VARIANT;

  constructor(private filterFactory: FilterFactoryService) {}

  ngAfterViewInit(): void {
    this.loadComponents();
  }

  private loadComponents() {
    this.config.forEach((comp: any, index: number) => {
      this.filterFactory.createFilter(comp, this.variant, this.query.toArray()[index]);
    });
  }
}
