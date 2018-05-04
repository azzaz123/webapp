import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Conversation } from '../../core/conversation/conversation';
import { MessageService } from '../../core/message/message.service';
import { EventService } from '../../core/event/event.service';
import { XmppService } from '../../core/xmpp/xmpp.service';
import { ConnectionService } from '../../core/connection/connection.service';

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
              private xmppService: XmppService,
              private connectionService: ConnectionService) {
  }

  ngOnInit() {
    this.eventService.subscribe(EventService.CONNECTION_ERROR, () => {
      this.disable = true;
    });
    this.eventService.subscribe(EventService.CONNECTION_RESTORED, () => {
      this.disable = false;
    });
    this.eventService.subscribe(EventService.USER_BLOCKED, (userId: string) => {
      if (this.currentConversation.user.id === userId) {
        this.disable = true;
      }
    });
    this.eventService.subscribe(EventService.USER_UNBLOCKED, (userId: string) => {
      if (this.currentConversation.user.id === userId) {
        this.disable = false;
      }
    });
  }

  sendMessage(messageArea: HTMLInputElement, $event: Event) {
    $event.preventDefault();
    if (!this.disable) {
      const message = messageArea.value.trim();
      if (message !== '') {
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
    }
    this.disable = this.currentConversation.user.blocked || !this.connectionService.isConnected;
  }

}
