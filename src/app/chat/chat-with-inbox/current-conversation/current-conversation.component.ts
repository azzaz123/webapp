import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { InboxMessage, phoneRequestState } from '../message/inbox-message';
import { InboxConversation } from '../inbox/inbox-conversation/inbox-conversation';

@Component({
  selector: 'tsl-current-conversation',
  templateUrl: './current-conversation.component.html',
  styleUrls: ['./current-conversation.component.scss']
})
export class CurrentConversationComponent implements OnInit, OnChanges {

  @Input() currentConversation: InboxConversation;

  constructor() { }

  ngOnInit() {
    console.log(this.currentConversation);
  }

  ngOnChanges() {
  }

  public showDate(previousMessage: InboxMessage, currentMessage: InboxMessage): boolean {
    return previousMessage ? new Date(previousMessage.date).toDateString() !== new Date(currentMessage.date).toDateString() : true;
  }

}
