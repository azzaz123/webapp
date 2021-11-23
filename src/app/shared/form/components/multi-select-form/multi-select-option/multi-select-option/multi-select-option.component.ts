import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { TemplateMultiSelectFormOption } from '../../interfaces/multi-select-form-option.interface';

@Component({
  selector: 'tsl-multi-select-option',
  templateUrl: './multi-select-option.component.html',
  styleUrls: ['./multi-select-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectOptionComponent {
  @Input() isDisabled = false;
  @Output() toggleOnChange = new EventEmitter();
  @Input() set option(value: TemplateMultiSelectFormOption) {
    this.data = value;
    this.hasChildren = !!value.children?.length;
    this.updateChildSelection();
  }
  public data: TemplateMultiSelectFormOption;
  public hasChildren = false;
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.isDisabled) {
      event.preventDefault();
    }
  }

  public selectedChildrenCount: number;

  private updateChildSelection(): void {
    this.selectedChildrenCount = this.getSelectedChildrenCount();
  }

  public getSelectedChildrenCount(): number {
    if (this.data.children?.length) {
      return [...this.data.children].filter((childOption) => childOption.checked).length;
    }
  }

  public toggleCheckbox(): void {
    this.toggleOnChange.emit();
  }
}
