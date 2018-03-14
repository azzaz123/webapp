import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Conversation, Message, I18nService, EventService } from 'shield';

@Component({
  selector: 'tsl-messages-panel',
  templateUrl: './messages-panel.component.html',
  styleUrls: ['./messages-panel.component.scss']
})
export class MessagesPanelComponent implements AfterViewChecked, OnChanges, OnInit {

  @Input() currentConversation: Conversation;
  @ViewChild('messagesPanel') messagesPanel: ElementRef;
  public momentConfig: any;
  public alreadyScrolled: boolean;

  constructor(i18n: I18nService, private event: EventService) {
    this.momentConfig = i18n.getTranslations('daysMomentConfig');
  }

  public showDate(previousMessage: Message, currentMessage: Message): boolean {
    return previousMessage ? new Date(previousMessage.date).toDateString() !== new Date(currentMessage.date).toDateString() : true;
  }

  ngAfterViewChecked() {
    if (this.messagesPanel && !this.alreadyScrolled) {
      this.messagesPanel.nativeElement.scrollTop = this.messagesPanel.nativeElement.scrollHeight;
      this.alreadyScrolled = true;
    }
  }

  ngOnChanges(changes?: any) {
    this.alreadyScrolled = false;
  }

  ngOnInit() {
    this.event.subscribe(EventService.NEW_MESSAGE, () => this.alreadyScrolled = false);
  }

}
