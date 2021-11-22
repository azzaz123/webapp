import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tsl-cancel-bubble',
  templateUrl: './cancel-bubble.component.html',
  styleUrls: ['./cancel-bubble.component.scss'],
})
export class CancelBubbleComponent {
  @Input() text: string;
  @Output() clear: EventEmitter<string> = new EventEmitter();

  public emitClear(event: MouseEvent): void {
    event.stopPropagation();
    this.clear.emit(this.text);
  }
}
