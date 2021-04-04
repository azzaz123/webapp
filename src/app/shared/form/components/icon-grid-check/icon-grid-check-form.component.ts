import { Component, forwardRef, Input } from '@angular/core';
import { IconGridOption } from '@shared/form/components/icon-grid-check/interfaces/icon-grid-option';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';

@Component({
  selector: 'tsl-icon-grid-check-form',
  templateUrl: './icon-grid-check-form.component.html',
  styleUrls: ['./icon-grid-check-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconGridCheckFormComponent),
      multi: true,
    },
  ],
})
export class IconGridCheckFormComponent extends AbstractFormComponent<string[]> {
  @Input() options: IconGridOption[];
  @Input() columns: number;
  @Input() isBig?: boolean;
  @Input() isMultiselect?: boolean;

  private selectedOptions: string[] = [];

  public writeValue(value: string[]) {
    super.writeValue(value);
    this.selectedOptions = value;
    this.onChange(value);
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
  }

  public isValueActive(value: string): boolean {
    return this.selectedOptions.includes(value);
  }

  private cleanValue(value: string) {
    this.writeValue(this.selectedOptions.filter((optionValue) => optionValue !== value));
  }
}
