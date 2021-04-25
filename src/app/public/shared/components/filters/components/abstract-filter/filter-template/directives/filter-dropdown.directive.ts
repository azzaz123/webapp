import { Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FiltersDropdownPosition } from '../interfaces/filter-dropdown-position.interface';

@Directive({
  selector: '[tslFilterDropdown]',
})
export class FilterDropdownDirective implements OnChanges, OnDestroy {
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();
  @Input() public dropdownOpened: boolean;

  constructor(private elementRef: ElementRef) {}

  private closeDropdownHandler;

  ngOnChanges(changes: SimpleChanges) {
    const { currentValue: dropdownOpened } = changes.dropdownOpened;

    if (dropdownOpened) {
      this.setDropdownPosition();
    }
  }

  ngOnDestroy() {
    document.removeEventListener('mousedown', this.closeDropdownHandler, true);
  }

  private closeAndRemoveListener(event: MouseEvent) {
    const clickedElement = event.target;

    if (!this.elementRef.nativeElement.contains(clickedElement)) {
      this.openChange.emit(false);
    }
  }

  private setDropdownPosition() {
    Object.assign(this.elementRef.nativeElement.style, this.getDropdownPosition());

    this.closeDropdownHandler = this.closeAndRemoveListener.bind(this);
    document.addEventListener('mousedown', this.closeDropdownHandler, true);
  }

  private getDropdownPosition(): FiltersDropdownPosition {
    const dropdownContentElement = this.elementRef.nativeElement;
    const dropdownAbsolutePosition = dropdownContentElement.getBoundingClientRect();
    const DROPDOWN_MARGIN = 50;
    const DROPDOWN_CONTENT_MIN_WIDTH = 380;
    const dropdownContentPosition: FiltersDropdownPosition = { top: `${76 + DROPDOWN_MARGIN}px` };

    if (DROPDOWN_CONTENT_MIN_WIDTH + dropdownAbsolutePosition.left > window.innerWidth) {
      dropdownContentPosition.right = `${DROPDOWN_MARGIN}px`;
    } else {
      dropdownContentPosition.left = `${dropdownAbsolutePosition.left}px`;
    }

    return dropdownContentPosition;
  }
}
