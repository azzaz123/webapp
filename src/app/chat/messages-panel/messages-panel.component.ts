import { Component, Input } from '@angular/core';
import { Conversation } from '../../core/conversation/conversation';
import { Message } from '../../core/message/message';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'tsl-messages-panel',
  templateUrl: './messages-panel.component.html',
  styleUrls: ['./messages-panel.component.scss']
})
export class MessagesPanelComponent {

  @Input() currentConversation: Conversation;
  public momentConfig: any;

  constructor(i18n: I18nService) {
    this.momentConfig = i18n.getTranslations('daysMomentConfig');
  }

  public showDate(previousMessage: Message, currentMessage: Message): boolean {
    return previousMessage ? new Date(previousMessage.date).getDay() !== new Date(currentMessage.date).getDay() : true;
  }

}
