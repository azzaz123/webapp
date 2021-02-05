import { Component, EventEmitter, Input, Output } from '@angular/core';

export enum BUBBLE_VARIANT {
  ACTIVE = 'active',
  SELECTED = 'selected',
}

@Component({
  selector: 'tsl-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss'],
})
export class BubbleComponent {
  @Input() icon: string;
  @Input() variant: BUBBLE_VARIANT = BUBBLE_VARIANT.ACTIVE;
  @Input() isDropdown: boolean;
  @Input() counter: number;
  @Input() isClearable: boolean;
  @Output() click: EventEmitter<MouseEvent> = new EventEmitter();
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

  public emitClick(event: MouseEvent): void {
    this.click.emit(event);
  }

  public emitClear(event: MouseEvent): void {
    this.clear.emit(event);
  }
}
