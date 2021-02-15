import { Filter } from '@public/shared/components/filters/interfaces/filter.interface';
import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FilterConfig } from '@public/shared/components/filters/interfaces/filter-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterTemplateComponent } from '@public/shared/components/filters/components/abstract-filter/filter-template/filter-template.component';

export abstract class AbstractFilter implements Filter {
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.BUBBLE;
  @Input() config: FilterConfig = { id: '', title: '' };
  @Input() value: FilterParameter[] = [];
  @Output() change = new EventEmitter<FilterParameter[]>();
  @Output() clear = new EventEmitter<void>();
  @Output() openStateChange: EventEmitter<boolean> = new EventEmitter();

  @ViewChild(FilterTemplateComponent) filterTemplate: FilterTemplateComponent;

  public isBubble(): boolean {
    return this.variant === FILTER_VARIANT.BUBBLE;
  }

  public isDropdown(): boolean {
    return true;
  }

  public hasValue(): boolean {
    return this.value.length > 0;
  }

  public hasApply(): boolean {
    return this.config.actions?.apply;
  }

  public isClearable(): boolean {
    return this.config.isClearable;
  }

  public abstract getLabel(): string;

  public getIcon(): string | undefined {
    return this.config.icon;
  }

  public getTitle(): string {
    return this.config.title;
  }

  public getFilterCounter(): number | undefined {
    return this.value.length > 1 ? this.value.length : undefined;
  }

  public handleApply(): void {}

  public handleClear(): void {
    this.clear.emit();
  }

  public handleOpenStateChange(isOpen: boolean): void {
    this.openStateChange.emit(isOpen);
  }
}
