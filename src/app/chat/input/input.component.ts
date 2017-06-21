import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Conversation } from '../../core/conversation/conversation';
import { MessageService } from '../../core/message/message.service';
import { EventService } from '../../core/event/event.service';

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
              private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.subscribe(EventService.CONNECTION_ERROR, () => {
      this.disable = true;
    });
    this.eventService.subscribe(EventService.CONNECTION_RESTORED, () => {
      this.disable = false;
    });
  }

  sendMessage(messageArea: HTMLInputElement, $event: Event) {
    $event.preventDefault();
    let message: string = messageArea.value.trim();
    if (message !== '') {
      this.messageService.send(this.currentConversation, message);
    }
    messageArea.value = '';
  }

  ngOnChanges(changes?: any) {
    if (this.messageArea) {
      setTimeout(() => {
        this.messageArea.nativeElement.focus();
      }, 500);
    }
  }

}
