import { Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FilterDropdownPosition } from '../interfaces/filter-dropdown-position.interface';

export const DROPDOWN_RIGHT_MARGIN = 10;
export const DROPDOWN_TOP_POSITION = 124;

@Directive({
  selector: '[tslFilterDropdown]',
})
export class FilterDropdownDirective implements OnChanges, OnDestroy {
  @Input() public dropdownOpened: boolean;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();
  private closeDropdownListener;
  constructor(private elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    const { currentValue: dropdownOpened } = changes.dropdownOpened;

    if (dropdownOpened) {
      this.setDropdownPosition();
    } else {
      this.removeEventListener();
    }
  }

  ngOnDestroy() {
    this.removeEventListener();
  }

  private closeAndRemoveListener(event: MouseEvent) {
    const clickedElement = event.target;
    const parentElement = this.elementRef.nativeElement.parentNode;

    if (parentElement.contains(clickedElement)) {
      return;
    }
    this.openChange.emit(false);
  }

  private removeEventListener(): void {
    document.removeEventListener('mousedown', this.closeDropdownListener, true);
  }

  private setDropdownPosition() {
    //TODO: This operation can be avoided if screen resolution is less than SM breakpoint
    Object.assign(this.elementRef.nativeElement.style, this.getDropdownPosition());

    this.closeDropdownListener = this.closeAndRemoveListener.bind(this);
    document.addEventListener('mousedown', this.closeDropdownListener, true);
  }

  private getDropdownPosition(): FilterDropdownPosition {
    const dropdownContentElement: HTMLElement = this.elementRef.nativeElement;
    const dropdownContentPosition: FilterDropdownPosition = { top: `${DROPDOWN_TOP_POSITION}px` };
    const dropdownWidth = dropdownContentElement.clientWidth;
    const bubbleElement: HTMLElement = this.elementRef.nativeElement.parentNode.querySelector('tsl-bubble');
    const bubbleAbsoluteXPosition = bubbleElement.getBoundingClientRect().x;
    const bubbleAbsoluteLeftPosition = bubbleElement.getBoundingClientRect().left;

    dropdownContentPosition.left = 'unset';
    dropdownContentPosition.right = 'unset';

    if (bubbleAbsoluteXPosition + dropdownWidth > window.innerWidth) {
      dropdownContentPosition.right = `${DROPDOWN_RIGHT_MARGIN}px`;
    } else if (bubbleAbsoluteXPosition < 0) {
      dropdownContentPosition.left = `${DROPDOWN_RIGHT_MARGIN}px`;
    } else {
      dropdownContentPosition.left = `${bubbleAbsoluteLeftPosition}px`;
    }

    return dropdownContentPosition;
  }
}
