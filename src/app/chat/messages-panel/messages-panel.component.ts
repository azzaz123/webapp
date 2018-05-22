import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Conversation } from '../../core/conversation/conversation';
import { I18nService } from '../../core/i18n/i18n.service';
import { Message, messageStatus } from '../../core/message/message';
import { EventService } from '../../core/event/event.service';
import { PersistencyService } from '../../core/persistency/persistency.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'tsl-messages-panel',
  templateUrl: './messages-panel.component.html',
  styleUrls: ['./messages-panel.component.scss']
})
export class MessagesPanelComponent implements AfterViewChecked, OnChanges, OnInit, OnDestroy {

  @Input() currentConversation: Conversation;
  @ViewChild('messagesPanel') messagesPanel: ElementRef;
  public momentConfig: any;
  private alreadyScrolled: boolean;
  private messageSentAckSubscription: Subscription;

  constructor(i18n: I18nService, private event: EventService, private persistencyService: PersistencyService) {
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

    this.messageSentAckSubscription = this.event.subscribe(EventService.MESSAGE_SENT_ACK, (thread, messageId) => {
      if (this.currentConversation.id === thread) {
        this.markAs(messageStatus.SENT, messageId);
      }
    });
  }

  ngOnDestroy() {
    this.messageSentAckSubscription.unsubscribe();
  }

  private markAs(newStatus: number, messageId: string) {
    this.currentConversation.messages.filter((message) => {
      return message.id === messageId;
    }).forEach((message) => {
      if (!message.status || message.status < newStatus) {
        message.status = newStatus;
        this.persistencyService.updateMessageStatus(messageId, newStatus);
      }
    });
  }
}
