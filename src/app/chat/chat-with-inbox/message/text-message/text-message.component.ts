import { Component, Input } from '@angular/core';
import { InboxMessage } from '../inbox-message';
import { InboxConversation } from '../../inbox/inbox-conversation/inbox-conversation';

@Component({
  selector: 'tsl-text-message',
  templateUrl: 'text-message.component.html',
  styleUrls: ['text-message.component.scss', '../message.component.scss']
})
export class TextMessageComponent {

  @Input() message: InboxMessage;
  @Input() currentConversation: InboxConversation;
}
