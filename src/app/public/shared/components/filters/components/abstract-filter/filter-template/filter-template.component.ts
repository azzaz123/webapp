import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BUBBLE_VARIANT } from '@public/shared/components/bubble/bubble.enum';

@Component({
  selector: 'tsl-filter-template',
  templateUrl: './filter-template.component.html',
  styleUrls: ['./filter-template.component.scss'],
})
export class FilterTemplateComponent {
  @Input() isBubble?: boolean;
  @Input() isDropdown?: boolean;
  @Input() hasValue?: boolean;
  @Input() counter?: number;
  @Input() icon?: string;
  @Input() label: string;
  @Input() title: string;
  @Input() hasApply?: boolean;
  @Input() isClearable?: boolean;
  @Input() hasMaxHeight = true;
  @Output() apply: EventEmitter<void> = new EventEmitter();
  @Output() clear: EventEmitter<void> = new EventEmitter();
  @Output() click: EventEmitter<void> = new EventEmitter();
  @Output() openStateChange: EventEmitter<boolean> = new EventEmitter();

  public BUBBLE_VARIANT = BUBBLE_VARIANT;

  public isDropdownOpen = false;

  public handleBubbleClick(event: MouseEvent): void {
    if (this.isDropdown) {
      this.toggleDropdown();
    }

    this.click.emit();

    event.stopPropagation();
  }

  public handleOpenChange(isOpen: boolean): void {
    this.isDropdownOpen = isOpen;
    this.openStateChange.emit(isOpen);
  }

  public handleCancel(event: MouseEvent): void {
    event.stopPropagation();
    this.closeDropdown();
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
