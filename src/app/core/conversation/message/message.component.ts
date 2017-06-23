import { Component, Input } from '@angular/core';
import { Message } from 'shield';

@Component({
  selector: 'tsl-message',
  templateUrl: 'message.component.html',
  styleUrls: ['message.component.scss']
})
export class MessageComponent {

  @Input() message: Message;
  @Input() showUserInfo: boolean;
  @Input() callsPanel: boolean;

  constructor() {
  }

}
