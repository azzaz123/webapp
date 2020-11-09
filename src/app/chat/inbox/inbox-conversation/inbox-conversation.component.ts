import { Component, Input } from '@angular/core';
import { InboxConversation, InboxMessage, MessageType } from '../../model';
import { InboxConversationService } from '../../service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { ThirdVoiceDropPriceComponent } from '../../message/third-voice-drop-price';
import { ThirdVoiceReviewComponent } from '../../message/third-voice-review';
import { includes } from 'lodash-es';

@Component({
  selector: 'tsl-inbox-conversation',
  templateUrl: './inbox-conversation.component.html',
  styleUrls: ['./inbox-conversation.component.scss'],
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
    sameElse: 'D MMM.',
  };

  constructor(
    private inboxConversationService: InboxConversationService,
    private i18n: I18nService
  ) {}

  public dateIsThisYear(): boolean {
    return this.conversation && this.conversation.modifiedDate
      ? this.conversation.modifiedDate.getFullYear() ===
          new Date().getFullYear()
      : false;
  }

  public onClickArchiveConversation(): void {
    this.inboxConversationService.sendReadSignal(this.conversation);
    this.inboxConversationService
      .archive$(this.conversation)
      .subscribe(() => (this.conversation = null));
  }

  public isText(inboxMessage: InboxMessage): boolean {
    return inboxMessage.type === MessageType.TEXT;
  }

  public isThirdVoiceDropPrice(messageType: MessageType): boolean {
    return includes(
      ThirdVoiceDropPriceComponent.ALLOW_MESSAGES_TYPES,
      messageType
    );
  }

  public isThirdVoiceReview(messageType: MessageType): boolean {
    return includes(
      ThirdVoiceReviewComponent.ALLOW_MESSAGES_TYPES,
      messageType
    );
  }

  public getThirdVoiceTranslation(inboxMessage: InboxMessage): string {
    return this.i18n.getTranslations(inboxMessage.type);
  }
}
