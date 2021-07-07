import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tsl-bubble-with-cross',
  templateUrl: './bubble-with-cross.component.html',
  styleUrls: ['./bubble-with-cross.component.scss'],
})
export class BubbleWithCrossComponent {
  @Input() bubbleText: string;
  @Output() clear: EventEmitter<string> = new EventEmitter();

  public emitClear(event: MouseEvent): void {
    event.stopPropagation();
    this.clear.emit(this.bubbleText);
  }
}
