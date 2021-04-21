import { Component, Input } from '@angular/core';
import { CALENDAR_SPEC_TYPE } from '@core/i18n/moment/enums/calendar-spec-type.enum';
import { MomentCalendarSpecService } from '@core/i18n/moment/moment-calendar-spec.service';
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
  public momentCalendarSpec: CalendarSpec = this.momentCalendarSpecService.getCalendarSpec(CALENDAR_SPEC_TYPE.SHORT);

  constructor(private momentCalendarSpecService: MomentCalendarSpecService) {}

  public dateIsThisYear(): boolean {
    if (this.conversation && this.conversation.modifiedDate) {
      return this.conversation.modifiedDate.getFullYear() === new Date().getFullYear();
    }
    return false;
  }
}
