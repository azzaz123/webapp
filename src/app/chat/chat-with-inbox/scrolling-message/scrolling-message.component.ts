import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'tsl-scrolling-message',
  templateUrl: './scrolling-message.component.html',
  styleUrls: ['./scrolling-message.component.scss']
})
export class ScrollingMessageComponent {

  @Input() noMessages: number;

  isNullOrUndefinedOrEmpty(): boolean {
    return this.noMessages === null || this.noMessages === undefined || _.eq(this.noMessages, 0);
  }

  hasEqOneMessage(): boolean {
    return _.eq(this.noMessages, 1);
  }

  hasGtThanOneMessage(): boolean {
    return _.gt(this.noMessages, 1);
  }
}
