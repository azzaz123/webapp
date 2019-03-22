import { Component, Inject, Input, OnInit } from '@angular/core';
import { InboxMessage, phoneRequestState } from './inbox-message';
import { CurrentConversation } from '../current-conversation/current-conversation';
import { ConversationService } from '../../../core/inbox/conversation.service';

@Component({
  selector: 'tsl-inbox-message',
  templateUrl: 'inbox-message.component.html',
  styleUrls: ['inbox-message.component.scss']
})
export class InboxMessageComponent implements OnInit {

  @Input() message: InboxMessage;
  @Input() currentConversation: CurrentConversation;
  // public phoneRequestState = phoneRequestState;

  constructor(@Inject('SUBDOMAIN')
    private subdomain: string,
    private conversationService: ConversationService) {
  }

  ngOnInit() {
  }

  openDialog() {
    // this.conversationService.openPhonePopup(this.currentConversation);
  }
}
