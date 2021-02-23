import { Filter } from '@public/shared/components/filters/interfaces/filter.interface';
import { EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FilterConfig } from '@public/shared/components/filters/interfaces/filter-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterTemplateComponent } from '@public/shared/components/filters/components/abstract-filter/filter-template/filter-template.component';

export abstract class AbstractFilter<T extends Record<keyof T, string>> implements Filter<T>, OnInit {
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.BUBBLE;
  @Input() config: FilterConfig<T>;
  @Input() value: FilterParameter[] = [];
  @Output() change = new EventEmitter<FilterParameter[]>();
  @Output() clear = new EventEmitter<void>();
  @Output() openStateChange: EventEmitter<boolean> = new EventEmitter();

  @ViewChild(FilterTemplateComponent) filterTemplate: FilterTemplateComponent;

  public label: string;

  public ngOnInit(): void {
    this.label = this.config.bubblePlaceholder;
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

  public hasApply(): boolean {
    return this.config.actions?.apply;
  }

  public isClearable(): boolean {
    return this.config.isClearable;
  }

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

  public getValue(key: keyof T): string {
    return this.value?.find((parameter: FilterParameter) => parameter.key === this.config.mapKey[key])?.value;
  }
  public hasValueChanged(previous: FilterParameter[], current: FilterParameter[]): boolean {
    if (!previous) {
      return true;
    } else {
      const keys = Object.keys(this.config.mapKey);

      for (const key of keys) {
        if (previous[key] !== current[key]) {
          return true;
        }
      }
    }

    return false;
  }
}
