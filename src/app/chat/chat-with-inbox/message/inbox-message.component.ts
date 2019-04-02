import { Component, Input } from '@angular/core';
import { InboxMessage } from './inbox-message';
import { InboxConversation } from '../inbox/inbox-conversation/inbox-conversation';

@Component({
  selector: 'tsl-inbox-message',
  templateUrl: 'inbox-message.component.html',
  styleUrls: ['inbox-message.component.scss']
})
export class InboxMessageComponent {

  @Input() message: InboxMessage;
  @Input() currentConversation: InboxConversation;
}
