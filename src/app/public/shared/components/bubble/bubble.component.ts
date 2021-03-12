import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BUBBLE_VARIANT } from '@public/shared/components/bubble/bubble.enum';

@Component({
  selector: 'tsl-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss'],
})
export class BubbleComponent {
  @Input() icon: string;
  @Input() variant: BUBBLE_VARIANT = BUBBLE_VARIANT.ACTIVE;
  @Input() isDropdown: boolean;
  @Input() isDropdownOpen: boolean;
  @Input() counter: number;
  @Input() isClearable: boolean;
  @Output() clear: EventEmitter<MouseEvent> = new EventEmitter();

  public get counterText(): string {
    if (this.counter) {
      return this.counter <= 9 ? this.counter.toString() : '+9';
    }

    return '';
  }

  public get hasClearButton(): boolean {
    return this.isClearable && this.variant === BUBBLE_VARIANT.SELECTED;
  }

  public emitClear(event: MouseEvent): void {
    event.stopPropagation();
    this.clear.emit(event);
  }
}
