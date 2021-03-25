import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tsl-selector-filter-template',
  templateUrl: './selector-filter-template.component.html',
  styleUrls: ['./selector-filter-template.component.scss'],
})
export class SelectorFilterTemplateComponent {
  @Input() hasContentPlaceholder: boolean;
  @Input() placeholderLabel: string;
  @Input() placeholderSublabel?: string;
  @Input() placeholderIcon?: string;
  @Output() onPlaceholderClick = new EventEmitter<void>();

  public handlePlaceholderClick(): void {
    this.onPlaceholderClick.emit();
  }
}
