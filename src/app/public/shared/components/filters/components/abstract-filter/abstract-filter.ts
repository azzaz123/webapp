import { Filter } from '@public/shared/components/filters/interfaces/filter.interface';
import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FilterConfig } from '@public/shared/components/filters/interfaces/filter-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterTemplateComponent } from '@public/shared/components/filters/components/abstract-filter/filter-template/filter-template.component';

export abstract class AbstractFilter implements Filter {
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.BUBBLE;
  @Input() config: FilterConfig = { title: '' };
  @Input() value: FilterParameter[] = [];
  @Output() change = new EventEmitter<FilterParameter[]>();
  @Output() clear = new EventEmitter<void>();
  @Output() openStateChange: EventEmitter<boolean> = new EventEmitter();

  @ViewChild(FilterTemplateComponent) filterTemplate: FilterTemplateComponent;

  public abstract getLabel(): string | undefined;

  public getIcon(): string | undefined {
    return this.config.icon;
  }

  public get hasApply(): boolean {
    return this.config.actions?.apply;
  }

  public get hasCancel(): boolean {
    return this.config.actions?.cancel;
  }

  public get title(): string {
    return this.config.title;
  }

  public isBubble(): boolean {
    return this.variant === FILTER_VARIANT.BUBBLE;
  }

  public isDropdown(): boolean {
    return true;
  }

  public hasValue(): boolean {
    return this.value.length > 0;
  }

  public isClearable(): boolean {
    return this.config.isClearable;
  }

  public filterCounter(): number {
    return this.value.length > 1 ? this.value.length : undefined;
  }

  public handleApply(): void {}
}
