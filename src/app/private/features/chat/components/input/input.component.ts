import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { RealTimeService } from '@core/message/real-time.service';
import { InboxConversation } from '@private/features/chat/core/model';
import { LinkTransformPipe } from '@shared/pipes';
import { find, includes, isEmpty } from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'tsl-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() currentConversation: InboxConversation;
  @Output() typing = new EventEmitter();
  @Output() clickSentMessage = new EventEmitter();
  @ViewChild('messageTextarea', { static: true }) messageArea: ElementRef;

  public message: string;
  public isUserBlocked: boolean;
  public isFocus: boolean;

  constructor(
    private realTimeService: RealTimeService,
    private eventService: EventService,
    private i18n: I18nService,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.isFocus = true;
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
        const messageId = this.realTimeService.sendMessage(this.currentConversation, this.message);
        this.clickSentMessage.emit(messageId);
      }
      this.message = '';
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
    this.isUserBlocked = this.currentConversation.cannotChat;
  }

  ngAfterViewInit(): void {
    if (!this.deviceService.isMobile()) {
      this.messageArea.nativeElement.focus();
      this.isFocus = true;
    }
  }

  public getPlaceholder(): string {
    return this.isUserBlocked || !this.isMessagingAvailable()
      ? this.i18n.getTranslations('disableMessage')
      : this.i18n.getTranslations('writeMessage');
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

  public writing(): void {
    this.typing.emit();
  }

  private hasLinkInMessage(message: string): boolean {
    return !isEmpty(this.findLinksWhereLinkIsNotWallapop(message));
  }

  private findLinksWhereLinkIsNotWallapop(message: string): string[] {
    return find(message.match(LinkTransformPipe.LINK_REG_EXP), (link) => isEmpty(link.match(LinkTransformPipe.WALLAPOP_REG_EXP)));
  }
}
