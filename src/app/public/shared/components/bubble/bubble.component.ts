import { Component, EventEmitter, Input, Output } from '@angular/core';

export enum BubbleVariants {
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
  @Input() variant: BubbleVariants = BubbleVariants.ACTIVE;
  @Input() isDropdown: boolean;
  @Input() counter: number;
  @Output() onClick: EventEmitter<void> = new EventEmitter();

  public get counterText(): string {
    if (this.counter) {
      return this.counter <= 9 ? this.counter.toString() : '+9';
    }

    return '';
  }

  public emitClick(): void {
    this.onClick.emit();
  }
}
