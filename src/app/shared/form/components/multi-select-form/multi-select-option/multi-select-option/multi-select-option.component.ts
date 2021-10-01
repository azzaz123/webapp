import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { TemplateMultiSelectFormOption } from '../../interfaces/multi-select-form-option.interface';

@Component({
  selector: 'tsl-multi-select-option',
  templateUrl: './multi-select-option.component.html',
  styleUrls: ['./multi-select-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectOptionComponent {
  @Input() option: TemplateMultiSelectFormOption;
  @Input() isDisabled: boolean;
  @Input() hasChildren = false;
  @Output() toggleOnChange = new EventEmitter();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.isDisabled) {
      event.preventDefault();
    }
  }

  public toggleCheckbox(): void {
    this.toggleOnChange.emit();
  }
}
