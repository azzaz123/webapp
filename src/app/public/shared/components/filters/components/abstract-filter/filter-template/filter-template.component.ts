import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ViewOwnItemDetail } from '@core/analytics/analytics-constants';
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
  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Output() clear: EventEmitter<void> = new EventEmitter();
  @Output() click: EventEmitter<void> = new EventEmitter();
  @Output() openStateChange: EventEmitter<boolean> = new EventEmitter();
  @Output() scrolledToBottom: EventEmitter<void> = new EventEmitter();
  @ViewChild('scrollableContainer') private scrollableContainer: ElementRef;

  constructor(private elementRef: ElementRef) {}

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
    this.resetScroll();
  }

  public handleCancel(event: MouseEvent): void {
    event.stopPropagation();
    this.closeDropdown();
    this.cancel.emit();
    this.resetScroll();
  }

  public handleAccept(event: MouseEvent): void {
    event.stopPropagation();
    this.closeDropdown();
    this.apply.emit();
    this.resetScroll();
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

  private resetScroll(): void {
    this.scrollableContainer.nativeElement.scroll(0, 0);
  }
}
