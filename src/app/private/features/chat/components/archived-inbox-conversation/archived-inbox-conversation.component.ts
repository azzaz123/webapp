import { Component, Input, OnChanges } from '@angular/core';
import { I18nService } from '@core/i18n/i18n.service';
import { InboxConversation } from '@private/features/chat/core/model';

import { CalendarSpec } from 'moment';
@Component({
  selector: 'tsl-archived-inbox-conversation',
  templateUrl: './archived-inbox-conversation.component.html',
  styleUrls: ['./archived-inbox-conversation.component.scss'],
})
export class ArchivedInboxConversationComponent {
  @Input() conversation: InboxConversation;

  public unreadCounterDisplayLimit = 99;
  public momentConfig: CalendarSpec = {
    lastDay: this.i18n.getTranslations('defaultDaysMomentConfig').lastDay,
    sameDay: 'HH:mm',
    nextDay: 'ddd',
    lastWeek: 'D MMM.',
    nextWeek: 'ddd',
    sameElse: 'D MMM.',
  };

  constructor(private i18n: I18nService) {}

  public dateIsThisYear(): boolean {
    if (this.conversation && this.conversation.modifiedDate) {
      return this.conversation.modifiedDate.getFullYear() === new Date().getFullYear();
    }
    return false;
  }
}
