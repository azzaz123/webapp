import { Component, OnInit } from '@angular/core';

import { MessageComponent } from '../message.component';
import { MessageType } from '../inbox-message';

@Component({
  selector: 'tsl-text-message',
  templateUrl: 'text-message.component.html',
  styleUrls: ['text-message.component.scss', '../message.component.scss']
})
export class TextMessageComponent extends MessageComponent implements OnInit {

  public static allowMessageTypes = [MessageType.TEXT];

  ngOnInit() {
    super.ngOnInit();
  }
}
