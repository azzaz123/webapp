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
  @Input() contentTitle?: string;
  @Input() isClearable?: boolean;
  @Output() clear = new EventEmitter<void>();

  public isPlaceholderOpen = false;

  public togglePlaceholderOpen(): void {
    this.isPlaceholderOpen = !this.isPlaceholderOpen;
  }

  public handleClear(): void {
    this.clear.emit();
  }
}
