import { AfterViewChecked, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Conversation, Message, I18nService } from 'shield';
import { current } from 'codelyzer/util/syntaxKind';

@Component({
  selector: 'tsl-messages-panel',
  templateUrl: './messages-panel.component.html',
  styleUrls: ['./messages-panel.component.scss']
})
export class MessagesPanelComponent implements AfterViewChecked {

  @Input() currentConversation: Conversation;
  @ViewChild('messagesPanel') messagesPanel: ElementRef;
  public momentConfig: any;

  constructor(i18n: I18nService) {
    this.momentConfig = i18n.getTranslations('daysMomentConfig');
  }

  public showDate(previousMessage: Message, currentMessage: Message): boolean {
    return previousMessage ? new Date(previousMessage.date).toDateString() !== new Date(currentMessage.date).toDateString() : true;
  }

  ngAfterViewChecked() {
    if (this.messagesPanel) {
      this.messagesPanel.nativeElement.scrollTop = this.messagesPanel.nativeElement.scrollHeight;
    }
  }

}
