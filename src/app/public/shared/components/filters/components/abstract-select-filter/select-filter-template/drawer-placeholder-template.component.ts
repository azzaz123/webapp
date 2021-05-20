import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tsl-drawer-placeholder-template',
  templateUrl: './drawer-placeholder-template.component.html',
  styleUrls: ['./drawer-placeholder-template.component.scss'],
})
export class DrawerPlaceholderTemplateComponent {
  @Input() hasContentPlaceholder: boolean;
  @Input() placeholderLabel: string;
  @Input() placeholderSublabel?: string;
  @Input() placeholderIcon?: string;
  @Input() contentTitle?: string;
  @Input() isClearable?: boolean;
  @Output() clear = new EventEmitter<void>();
  @Output() placeholderOpenStateChange = new EventEmitter<boolean>();

  public isPlaceholderOpen = false;

  public togglePlaceholderOpen(): void {
    this.isPlaceholderOpen = !this.isPlaceholderOpen;
    this.placeholderOpenStateChange.emit(this.isPlaceholderOpen);
  }

  public handleClear(): void {
    this.clear.emit();
  }
}
