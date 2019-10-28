import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Conversation } from '../../core/conversation/conversation';
import { MessageService } from '../../core/message/message.service';
import { EventService } from '../../core/event/event.service';
import { TrackingService } from '../../core/tracking/tracking.service';
import { InboxConversation } from '../model/inbox-conversation';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockSendLinkComponent } from '../modals/block-send-link';
import { LinkTransformPipe } from '../../shared/pipes/link-transform';
import { includes, isEmpty, find } from 'lodash-es';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'tsl-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnChanges, OnInit {

  @Input() currentConversation: Conversation | InboxConversation;
  @ViewChild('messageArea') messageArea: ElementRef;

  public isUserBlocked: boolean;

  constructor(private messageService: MessageService,
              private eventService: EventService,
              private trackingService: TrackingService,
              private modalService: NgbModal,
              private i18n: I18nService) {
  }

  ngOnInit() {
    this.isUserBlocked = false;
    this.eventService.subscribe(EventService.PRIVACY_LIST_UPDATED, (userIds: string[]) => {
      this.isUserBlocked = includes(userIds, this.currentConversation.user.id);
    });
  }

  sendMessage(messageArea: HTMLTextAreaElement, $event: Event) {
    $event.preventDefault();
    if (!this.isUserBlocked) {
      const message = messageArea.value.trim();
      if (!isEmpty(message)) {
        if (this.hasLinkInMessage(message)) {
          this.modalService.open(BlockSendLinkComponent, { windowClass: 'modal-transparent' });
        } else {
          this.trackingService.track(TrackingService.SEND_BUTTON, {
            thread_id: this.currentConversation.id,
          });
          this.messageService.send(this.currentConversation, message);
          messageArea.value = '';
        }
      } else {
        messageArea.value = '';
      }
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
    this.isUserBlocked = this.currentConversation instanceof Conversation ? this.currentConversation.user.blocked
      : this.currentConversation.cannotChat;
  }

  getPlaceholder(): string {
    return this.isUserBlocked || !this.isMessagingAvailable() ? '' : this.i18n.getTranslations('writeMessage');
  }

  public isMessagingAvailable(): boolean {
    if (this.currentConversation instanceof InboxConversation) {
      return !this.isUserBlocked && !this.currentConversation.cannotChat;
    }
    return !this.isUserBlocked;
  }

  private hasLinkInMessage(message: string): boolean {
    return !isEmpty(this.findLinksWhereLinkIsNotWallapop(message));
  }

  private findLinksWhereLinkIsNotWallapop(message: string): string[] {
    return find(message.match(LinkTransformPipe.LINK_REG_EXP), link => isEmpty(link.match(LinkTransformPipe.WALLAPOP_REG_EXP)));
  }
}
