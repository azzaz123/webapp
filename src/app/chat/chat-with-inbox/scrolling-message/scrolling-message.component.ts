import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { eq, gt } from 'lodash';

@Component({
  selector: 'tsl-scrolling-message',
  templateUrl: './scrolling-message.component.html',
  styleUrls: ['./scrolling-message.component.scss']
})
export class ScrollingMessageComponent {

  @Input() noMessages: number;
  @Input() isVisible = true;
  @Output() clickScroll = new EventEmitter();

  isNullOrUndefinedOrEmpty(): boolean {
    return this.noMessages === null || this.noMessages === undefined || eq(this.noMessages, 0);
  }

  hasEqOneMessage(): boolean {
    return eq(this.noMessages, 1);
  }

  hasGtThanOneMessage(): boolean {
    return gt(this.noMessages, 1);
  }

  onClickScrollDown(): void {
    this.clickScroll.emit();
  }
}
