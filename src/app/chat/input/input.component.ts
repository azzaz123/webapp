import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Conversation } from '../../core/conversation/conversation';
import { MessageService } from '../../core/message/message.service';
import { EventService } from '../../core/event/event.service';
import { TrackingService } from '../../core/tracking/tracking.service';
import { InboxConversation } from '../model/inbox-conversation';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockSendLinkComponent } from '../modals/block-send-link';
import { LinkTransformPipe } from '../../shared/pipes/link-transform';
import { I18nService } from '../../core/i18n/i18n.service';
import { isEmpty, includes, find } from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RemoteConsoleService } from '../../core/remote-console';

@Component({
  selector: 'tsl-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnChanges, OnInit, AfterViewInit {

  @Input() currentConversation: Conversation | InboxConversation;
  @ViewChild('messageTextarea') messageArea: ElementRef;

  public message: string;
  public isUserBlocked: boolean;
  public isFocus: boolean;

  constructor(private messageService: MessageService,
              private eventService: EventService,
              private trackingService: TrackingService,
              private remoteConsoleService: RemoteConsoleService,
              private modalService: NgbModal,
              private i18n: I18nService,
              private deviceService: DeviceDetectorService) {
  }

  ngOnInit() {
    this.isUserBlocked = false;
    this.eventService.subscribe(EventService.PRIVACY_LIST_UPDATED, (userIds: string[]) => {
      this.isUserBlocked = includes(userIds, this.currentConversation.user.id);
    });
  }

  sendMessage($event: Event) {
    $event.preventDefault();
    this.message = this.message.trim();
    if (!this.isUserBlocked) {
      if (!this.isEmpty()) {
        if (this.hasLinkInMessage(this.message)) {
          this.modalService.open(BlockSendLinkComponent, { windowClass: 'modal-transparent' });
        } else {
          this.trackingService.track(TrackingService.SEND_BUTTON, {
            thread_id: this.currentConversation.id,
          });
          this.messageService.send(this.currentConversation, this.message);
          this.message = '';
        }
      } else {
        this.message = '';
      }
    }
  }

  ngOnChanges(changes?: any) {
    if (this.messageArea) {
      if (!this.deviceService.isMobile()) {
        setTimeout(() => {
          this.messageArea.nativeElement.focus();
          this.isFocus = true;
        }, 500);
      }

      if (changes && changes.currentConversation && this.messageArea.nativeElement.value.length) {
        this.message = '';
      }
    }
    this.isUserBlocked = this.currentConversation instanceof Conversation ? this.currentConversation.user.blocked
      : this.currentConversation.cannotChat;
  }

  ngAfterViewInit(): void {
    if (!this.deviceService.isMobile()) {
      this.messageArea.nativeElement.focus();
      this.isFocus = true;
    }
  }

  public getPlaceholder(): string {
    return this.isUserBlocked || !this.isMessagingAvailable() ? '' : this.i18n.getTranslations('writeMessage');
  }

  public isMessagingAvailable(): boolean {
    if (this.currentConversation instanceof InboxConversation) {
      return !this.isUserBlocked && !this.currentConversation.cannotChat;
    }
    return !this.isUserBlocked;
  }

  public isEmpty(): boolean {
    return this.message === null || this.message === undefined || isEmpty(this.message.trim());
  }

  public onFocusElement() {
    this.isFocus = !this.isFocus;
  }

  private hasLinkInMessage(message: string): boolean {
    return !isEmpty(this.findLinksWhereLinkIsNotWallapop(message));
  }

  private findLinksWhereLinkIsNotWallapop(message: string): string[] {
    return find(message.match(LinkTransformPipe.LINK_REG_EXP), link => isEmpty(link.match(LinkTransformPipe.WALLAPOP_REG_EXP)));
  }
}
