import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Conversation } from '../../core/conversation/conversation';
import { MessageService } from '../../core/message/message.service';
import { EventService } from '../../core/event/event.service';
import { TrackingService } from '../../core/tracking/tracking.service';

@Component({
  selector: 'tsl-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnChanges, OnInit {

  @Input() currentConversation: Conversation;
  @ViewChild('messageArea') messageArea: ElementRef;
  public disable: boolean;

  constructor(private messageService: MessageService,
              private eventService: EventService,
              private trackingService: TrackingService
              ) {
  }

  sendMessage(messageArea: HTMLInputElement, $event: Event) {
    $event.preventDefault();
    if (!this.disable) {
      const message = messageArea.value.trim();
      if (message !== '') {
        this.trackingService.track(TrackingService.SEND_BUTTON, {
          thread_id: this.currentConversation.id,
        });
        this.messageService.send(this.currentConversation, message);
      }
      messageArea.value = '';
    }
  }

  ngOnInit() {
    this.eventService.subscribe(EventService.PRIVACY_LIST_UPDATED, (userIds: string[]) => {
      this.disable = userIds.indexOf(this.currentConversation.user.id) !== -1;
    });
  }

  ngOnChanges(changes?: any) {
    if (this.messageArea) {
      setTimeout(() => {
        this.messageArea.nativeElement.focus();
      }, 500);

      if (changes && changes.currentConversation && this.messageArea.nativeElement.value.length) {
        this.messageArea.nativeElement.value = '';
      }
    }
    this.disable = this.currentConversation.user.blocked;
  }
}
