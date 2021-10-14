import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BUBBLE_VARIANT } from '@public/shared/components/bubble/bubble.enum';

@Component({
  selector: 'tsl-filter-template',
  templateUrl: './filter-template.component.html',
  styleUrls: ['./filter-template.component.scss'],
})
export class FilterTemplateComponent implements OnChanges {
  @Input() isBubble?: boolean;
  @Input() isDropdown?: boolean;
  @Input() hasValue?: boolean;
  @Input() counter?: number;
  @Input() icon?: string;
  @Input() label: string | string[];
  @Input() title: string;
  @Input() hasApply?: boolean;
  @Input() isClearable?: boolean;
  @Output() apply: EventEmitter<void> = new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Output() clear: EventEmitter<void> = new EventEmitter();
  @Output() click: EventEmitter<void> = new EventEmitter();
  @Output() openStateChange: EventEmitter<boolean> = new EventEmitter();

  public BUBBLE_VARIANT = BUBBLE_VARIANT;
  public isDropdownOpen = false;
  public isMultiValue = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.isMultiValue = changes.label && this.hasValue && Array.isArray(this.label);
  }

  public handleBubbleClick(event: MouseEvent): void {
    if (this.isDropdown) {
      this.toggleDropdown();
    }

    this.click.emit();

    event.stopPropagation();
  }

  public handleOpenChange(isOpen: boolean): void {
    this.openStateChange.emit(isOpen);
    this.isDropdownOpen = isOpen;
  }

  public handleCancel(event: MouseEvent): void {
    event.stopPropagation();
    this.closeDropdown();
    this.cancel.emit();
  }

  public handleAccept(event: MouseEvent): void {
    event.stopPropagation();
    this.closeDropdown();
    this.apply.emit();
  }

  public handleClear(): void {
    this.closeDropdown();
    this.clear.emit();
  }

  public toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.openStateChange.emit(this.isDropdownOpen);
  }

  private closeDropdown(): void {
    this.isDropdownOpen = false;
    this.openStateChange.emit(this.isDropdownOpen);
  }
}
