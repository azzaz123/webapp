import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractSelectorFilter } from '../abstract-selector-filter/abstract-selector-filter';
import { FilterOption } from '../../core/interfaces/filter-option.interface';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';
import { SelectorFilterParams } from './interfaces/selector-filter-params.interface';
import { SelectorFilterTemplateComponent } from '../abstract-selector-filter/selector-filter-template/selector-filter-template.component';
import { FilterTemplateComponent } from '../abstract-filter/filter-template/filter-template.component';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { SelectorFilterConfig } from './interfaces/selector-filter-config.interface';

@Component({
  selector: 'tsl-selector-filter',
  templateUrl: './selector-filter.component.html',
  styleUrls: ['./selector-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorFilterComponent extends AbstractSelectorFilter<SelectorFilterParams> implements OnInit, OnDestroy {
  @Input() config: SelectorFilterConfig;

  @ViewChild('selectorFilterTemplateComponent', { read: SelectorFilterTemplateComponent })
  public selectorFilterTemplate: SelectorFilterTemplateComponent;
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
      this.selectorFilterTemplate.togglePlaceholderOpen();
    }
  }
}
