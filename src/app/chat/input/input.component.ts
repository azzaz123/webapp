import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { Conversation } from '../../core/conversation/conversation';
import { MessageService } from '../../core/message/message.service';
import { TrackingService } from '../../core/tracking/tracking.service';

@Component({
  selector: 'tsl-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnChanges {

  @Input() currentConversation: Conversation;
  @ViewChild('messageArea') messageArea: ElementRef;
  public disable: boolean;

  constructor(private messageService: MessageService,
              private trackingService: TrackingService,
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
