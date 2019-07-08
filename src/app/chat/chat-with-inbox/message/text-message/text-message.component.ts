import { Component } from '@angular/core';

import { MessageComponent } from '../message.component';

@Component({
  selector: 'tsl-text-message',
  templateUrl: 'text-message.component.html',
  styleUrls: ['text-message.component.scss', '../message.component.scss']
})
export class TextMessageComponent extends MessageComponent {
}
