import { Component, Inject, Input, OnInit } from '@angular/core';
import { Message, phoneRequestState } from '../../core/message/message';
import { Conversation } from '../../core/conversation/conversation';
import { ConversationService } from '../../core/conversation/conversation.service';

@Component({
  selector: 'tsl-message',
  templateUrl: 'message.component.html',
  styleUrls: ['message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;
  @Input() showUserInfo: boolean;
  @Input() callsPanel: boolean;
  @Input() currentConversation: Conversation;
  public userWebSlug: string;
  public phoneRequestState = phoneRequestState;

  constructor(@Inject('SUBDOMAIN')
    private subdomain: string,
    private conversationService: ConversationService) {
  }

  ngOnInit() {
    this.userWebSlug = this.message.user ? this.message.user.getUrl(this.subdomain) : null;
  }

  openDialog() {
    this.conversationService.openPhonePopup(this.currentConversation);
  }
}
