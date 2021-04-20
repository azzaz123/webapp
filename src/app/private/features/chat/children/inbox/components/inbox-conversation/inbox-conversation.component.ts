import { Component, Input } from '@angular/core';
import { I18nService } from '@core/i18n/i18n.service';
import { CALENDAR_SPEC_TYPE } from '@core/i18n/moment/enums/calendar-spec-type.enum';
import { MomentCalendarSpecService } from '@core/i18n/moment/moment-calendar-spec.service';
import { ThirdVoiceDropPriceComponent } from '@private/features/chat/children/message/components/third-voice-drop-price';
import { ThirdVoiceReviewComponent } from '@private/features/chat/children/message/components/third-voice-review';
import { InboxConversationService } from '@private/features/chat/core/inbox/inbox-conversation.service';
import { InboxConversation, InboxMessage, MessageType } from '@private/features/chat/core/model';
import { includes } from 'lodash-es';
import { CalendarSpec } from 'moment';

@Component({
  selector: 'tsl-inbox-conversation',
  templateUrl: './inbox-conversation.component.html',
  styleUrls: ['./inbox-conversation.component.scss'],
})
export class InboxConversationComponent {
  @Input() conversation: InboxConversation;
  @Input() archiveConversation = false;

  public unreadCounterDisplayLimit = 99;
  public momentCalendarSpec: CalendarSpec = this.momentCalendarSpecService.getCalendarSpec(CALENDAR_SPEC_TYPE.SHORT);

  constructor(
    private inboxConversationService: InboxConversationService,
    private i18n: I18nService,
    private momentCalendarSpecService: MomentCalendarSpecService
  ) {}

  public dateIsThisYear(): boolean {
    return this.conversation && this.conversation.modifiedDate
      ? this.conversation.modifiedDate.getFullYear() === new Date().getFullYear()
      : false;
  }

  public onClickArchiveConversation(): void {
    this.inboxConversationService.sendReadSignal(this.conversation);
    this.inboxConversationService.archive$(this.conversation).subscribe(() => (this.conversation = null));
  }

  public isText(inboxMessage: InboxMessage): boolean {
    return inboxMessage.type === MessageType.TEXT;
  }

  public isThirdVoiceDropPrice(messageType: MessageType): boolean {
    return includes(ThirdVoiceDropPriceComponent.ALLOW_MESSAGES_TYPES, messageType);
  }

  public isThirdVoiceReview(messageType: MessageType): boolean {
    return includes(ThirdVoiceReviewComponent.ALLOW_MESSAGES_TYPES, messageType);
  }

  public getThirdVoiceTranslation(inboxMessage: InboxMessage): string {
    return this.i18n.getTranslations(inboxMessage.type);
  }
}
