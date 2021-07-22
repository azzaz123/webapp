import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { GridSelectFormOption } from '@shared/form/components/grid-select/interfaces/grid-select-form-option.interface';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';

@Component({
  selector: 'tsl-grid-select-form',
  templateUrl: './grid-select-form.component.html',
  styleUrls: ['./grid-select-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GridSelectFormComponent),
      multi: true,
    },
  ],
})
export class GridSelectFormComponent extends AbstractFormComponent<string[]> implements OnInit {
  @Input() options: GridSelectFormOption[];
  @Input() columns: number;
  @Input() columnsSm?: number;
  @Input() columnsMd?: number;
  @Input() columnsLg?: number;
  @Input() columnsXl?: number;
  @Input() isBig?: boolean;
  @Input() isMultiselect?: boolean;
  @Input() isHoverMainColor?: boolean;

  private selectedOptions: string[] = [];
  public gridClasses: string[] = [];

  ngOnInit(): void {
    this.setGridColumns();
  }

  public writeValue(value: string[]) {
    super.writeValue(value);
    this.selectedOptions = value;
  }

  public handleOptionClick(value: string): void {
    if (this.isValueActive(value)) {
      return this.cleanValue(value);
    }

    if (this.isMultiselect) {
      this.writeValue([...this.selectedOptions, value]);
    } else {
      this.writeValue([value]);
    }

    this.onChange(this.value);
  }

  public isValueActive(value: string): boolean {
    return this.selectedOptions.includes(value);
  }

  private setGridColumns(): void {
    this.gridClasses = [`col-${this.columns}`];
    if (this.columnsSm) {
      this.gridClasses.push(`col-sm-${this.columnsSm}`);
    }
    if (this.columnsMd) {
      this.gridClasses.push(`col-md-${this.columnsMd}`);
    }
    if (this.columnsLg) {
      this.gridClasses.push(`col-lg-${this.columnsLg}`);
    }
    if (this.columnsXl) {
      this.gridClasses.push(`col-xl-${this.columnsXl}`);
    }
  }

  private cleanValue(value: string) {
    this.writeValue(this.selectedOptions.filter((optionValue) => optionValue !== value));
    this.onChange(this.value);
  }
}
