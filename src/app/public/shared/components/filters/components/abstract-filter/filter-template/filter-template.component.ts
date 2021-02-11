import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
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
  @Output() apply: EventEmitter<void> = new EventEmitter();
  @Output() clear: EventEmitter<void> = new EventEmitter();
  @Output() click: EventEmitter<void> = new EventEmitter();
  @Output() openStateChange: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('dropdown', { read: NgbDropdown }) dropdown: NgbDropdown;

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
    this.openStateChange.emit(isOpen);
    this.isDropdownOpen = isOpen;
  }

  public handleCancel(event: MouseEvent): void {
    event.stopPropagation();
    this.dropdown.close();
  }

  public handleAccept(event: MouseEvent): void {
    event.stopPropagation();
    this.dropdown.close();
    this.apply.emit();
  }

  public handleClear(): void {
    this.dropdown.close();
    this.clear.emit();
  }

  private toggleDropdown(): void {
    this.dropdown.toggle();
  }
}
