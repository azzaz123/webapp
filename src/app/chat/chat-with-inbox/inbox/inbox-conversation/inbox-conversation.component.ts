import { Component, Input } from '@angular/core';
import { InboxConversation, InboxMessage } from '../../../model';
import { InboxConversationService } from '../../../../core/inbox/inbox-conversation.service';
import { InboxService } from '../../../../core/inbox/inbox.service';
import { RealTimeService } from '../../../../core/message/real-time.service';
import { last } from 'lodash-es';

@Component({
  selector: 'tsl-inbox-conversation',
  templateUrl: './inbox-conversation.component.html',
  styleUrls: ['./inbox-conversation.component.scss']
})
export class InboxConversationComponent {

  @Input() conversation: InboxConversation;
  @Input() archiveConversation = false;

  public unreadCounterDisplayLimit = 99;
  public momentConfig: any = {
    lastDay: '[Yesterday]',
    sameDay: 'HH:mm',
    nextDay: 'ddd',
    lastWeek: 'D MMM.',
    nextWeek: 'ddd',
    sameElse: 'D MMM.'
  };

  constructor(private inboxConversationService: InboxConversationService) {
  }

  public dateIsThisYear(): boolean {
    return this.conversation && this.conversation.modifiedDate
      ? this.conversation.modifiedDate.getFullYear() === new Date().getFullYear() : false;
  }

  public onClickArchiveConversation(): void {
    this.inboxConversationService.sendReadSignal(this.conversation);
    this.inboxConversationService.archive$(this.conversation).subscribe(() => this.conversation = null);
  }
}
