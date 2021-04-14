import { Component, forwardRef, Input } from '@angular/core';
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
export class GridSelectFormComponent extends AbstractFormComponent<string[]> {
  @Input() options: GridSelectFormOption[];
  @Input() columns: number;
  @Input() columnsMd?: number;
  @Input() columnsSm?: number;
  @Input() isBig?: boolean;
  @Input() isMultiselect?: boolean;
  @Input() isHoverMainColor?: boolean;

  private selectedOptions: string[] = [];

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

  private cleanValue(value: string) {
    this.writeValue(this.selectedOptions.filter((optionValue) => optionValue !== value));
    this.onChange(this.value);
  }
}
