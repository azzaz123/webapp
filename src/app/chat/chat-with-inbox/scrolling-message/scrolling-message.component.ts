import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'tsl-scrolling-message',
  templateUrl: './scrolling-message.component.html',
  styleUrls: ['./scrolling-message.component.scss']
})
export class ScrollingMessageComponent {

  @Input() noMessages: number;

  isEmpty(): boolean {
    return _.eq(this.noMessages, 0);
  }
}
