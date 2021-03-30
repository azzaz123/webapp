import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractSelectFilter } from '../abstract-select-filter/abstract-select-filter';
import { FilterOption } from '../../core/interfaces/filter-option.interface';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';
import { SelectFilterParams } from './interfaces/select-filter-params.interface';
import { SelectFilterTemplateComponent } from '../abstract-select-filter/select-filter-template/select-filter-template.component';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { SelectFilterConfig } from './interfaces/select-filter-config.interface';

@Component({
  selector: 'tsl-option-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFilterComponent extends AbstractSelectFilter<SelectFilterParams> implements OnInit, OnDestroy {
  @Input() config: SelectFilterConfig;

  @ViewChild('selectFilterTemplateComponent', { read: SelectFilterTemplateComponent })
  public selectFilterTemplate: SelectFilterTemplateComponent;
  @ViewChild('filterTemplateComponent', { read: FilterTemplateComponent })
  public filterTemplate: FilterTemplateComponent;

  public options: FilterOption[] = [];
  private subscriptions = new Subscription();

  public getLabel(): string {
    const value = this.getValue('parameterKey');
    return value ? this.options.find((option) => option.value === value).label : this.getLabelPlaceholder();
  }

  // TODO: This could probably be included inside the AbstractFilter directly
  public handleClear() {
    this.writeValue([]);
    this.valueChange.emit(this.value);
    super.handleClear();
  }

  public handleOptionSelected(option: FilterOption): void {
    this.closeContent();
    this.writeValue([{ key: this.config.mapKey.parameterKey, value: option.value as string }]);
    this.valueChange.emit(this.value);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    const sub = super
      .getOptions()
      .pipe(take(1))
      .subscribe((options) => (this.options = options));
    this.subscriptions.add(sub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getLabelPlaceholder(): string {
    if (this.variant === FILTER_VARIANT.BUBBLE) {
      return this.config.bubblePlaceholder;
    }
    return this.config.drawerPlaceholder;
  }

  private closeContent(): void {
    if (this.variant === FILTER_VARIANT.BUBBLE) {
      this.filterTemplate.toggleDropdown();
    }
    if (this.config.hasContentPlaceholder) {
      this.selectFilterTemplate.togglePlaceholderOpen();
    }
  }
}
