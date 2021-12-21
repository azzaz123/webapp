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
  @Input() hasApplyButtonInDrawer?: boolean;
  @Output() clear = new EventEmitter<void>();
  @Output() apply = new EventEmitter<void>();
  @Output() placeholderOpenStateChange = new EventEmitter<boolean>();
  @Output() scrolledToBottom: EventEmitter<void> = new EventEmitter();

  public isPlaceholderOpen = false;

  public togglePlaceholderOpen(): void {
    this.isPlaceholderOpen = !this.isPlaceholderOpen;
    this.placeholderOpenStateChange.emit(this.isPlaceholderOpen);
  }

  public handleApply(): void {
    this.togglePlaceholderOpen();
    this.apply.emit();
  }

  public handleClear(): void {
    this.clear.emit();
  }
}
