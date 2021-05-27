import { Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FilterDropdownPosition } from '../interfaces/filter-dropdown-position.interface';

export const DROPDOWN_MARGIN = 10;
export const DROPDOWN_CONTENT_MAX_WIDTH = 750;

@Directive({
  selector: '[tslFilterDropdown]',
})
export class FilterDropdownDirective implements OnChanges, OnDestroy {
  @Input() public dropdownOpened: boolean;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  private closeDropdownListener;

  ngOnChanges(changes: SimpleChanges) {
    const { currentValue: dropdownOpened } = changes.dropdownOpened;

    if (dropdownOpened) {
      this.setDropdownPosition();
    }
  }

  ngOnDestroy() {
    document.removeEventListener('mousedown', this.closeDropdownListener, true);
  }

  private closeAndRemoveListener(event: MouseEvent) {
    const clickedElement = event.target;
    const parentElement = this.elementRef.nativeElement.parentNode;

    if (parentElement.contains(clickedElement)) {
      return;
    }
    this.openChange.emit(false);
  }

  private setDropdownPosition() {
    //TODO: This operation can be avoided if screen resolution is less than SM breakpoint
    Object.assign(this.elementRef.nativeElement.style, this.getDropdownPosition());

    this.closeDropdownListener = this.closeAndRemoveListener.bind(this);
    document.addEventListener('mousedown', this.closeDropdownListener, true);
  }

  private getDropdownPosition(): FilterDropdownPosition {
    const dropdownContentElement = this.elementRef.nativeElement;
    const dropdownAbsolutePosition = dropdownContentElement.getBoundingClientRect();
    const dropdownContentPosition: FilterDropdownPosition = { top: `${dropdownAbsolutePosition.top + DROPDOWN_MARGIN}px` };

    if (DROPDOWN_CONTENT_MAX_WIDTH + dropdownAbsolutePosition.left > window.innerWidth) {
      dropdownContentPosition.right = `${DROPDOWN_MARGIN}px`;
    }

    return dropdownContentPosition;
  }
}
