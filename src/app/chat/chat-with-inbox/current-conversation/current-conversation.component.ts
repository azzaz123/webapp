import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { InboxMessage } from '../message/inbox-message';
import { InboxConversation } from '../inbox/inbox-conversation/inbox-conversation';
import { EventService } from '../../../core/event/event.service';
import { RealTimeService } from '../../../core/message/real-time.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tsl-current-conversation',
  templateUrl: './current-conversation.component.html',
  styleUrls: ['./current-conversation.component.scss']
})
export class CurrentConversationComponent implements OnInit, OnDestroy {

  @Input() currentConversation: InboxConversation;
  @Input() conversationsTotal: number;
  @Input() connectionError: boolean;

  constructor(private eventService: EventService,
    private realTime: RealTimeService) {
  }

  private newMessageSubscription: Subscription;

  public momentConfig: any = {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: 'dddd, D MMM',
    lastWeek: 'dddd, D MMM',
    nextWeek: 'dddd, D MMM',
    sameElse: 'dddd, D MMM'
  };

  ngOnInit() {
    this.newMessageSubscription = this.eventService.subscribe(EventService.MESSAGE_ADDED,
      (message: InboxMessage) => this.sendRead(message));
  }

  ngOnDestroy() {
    this.currentConversation = null;
    this.newMessageSubscription.unsubscribe();
  }

  public showDate(currentMessage: InboxMessage, nextMessage: InboxMessage): boolean {
    return nextMessage ? new Date(currentMessage.date).toDateString() !== new Date(nextMessage.date).toDateString() : true;
  }

  public dateIsThisYear(date: Date) {
    return date.getFullYear() === new Date().getFullYear();
  }

  private sendRead(message: InboxMessage) {
    if (this.currentConversation.id === message.thread) {
      Visibility.onVisible(() => {
        setTimeout(() => {
          this.realTime.sendRead(this.currentConversation.user.id, this.currentConversation.id);
        }, 1000);
      });
    }
  }
}
