import { Component, OnInit, OnChanges, OnDestroy, Input, HostBinding, HostListener } from '@angular/core';
import { Remove } from '../../shared/archivable/animations';
import { Call } from '../../core/conversation/calls';
import { Message } from '../../core/message/message';
import { I18nService } from '../../core/i18n/i18n.service';
import { EventService } from '../../core/event/event.service';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ActivatedRoute } from '@angular/router';
import { CallsService } from '../../core/conversation/calls.service';
import { ConversationService } from '../../core/conversation/conversation.service';

@Component({
  selector: 'tsl-call-item',
  templateUrl: './call-item.component.html',
  styleUrls: ['./call-item.component.scss'],
  animations: [Remove('0.5s')]
})
export class CallItemComponent implements OnChanges, OnDestroy {

  @Input() call: Call;

  @HostBinding('class.archived') @HostBinding('@remove') archived = false;
  @HostBinding('class.archive') get archive(): boolean {
    return this.call.archived;
  }

  public formattedDuration = '-';
  public messages: Message[];
  public open = false;
  public momentConfig: any;
  private active = true;

  constructor(private i18n: I18nService,
              private eventService: EventService,
              private trackingService: TrackingService,
              private route: ActivatedRoute,
              private callService: CallsService,
              private conversationService: ConversationService) {
    this.momentConfig = i18n.getTranslations('daysMomentConfig');
    this.eventService.subscribe(EventService.CLOSE_EXPANDED_CALLS, () => {
      if (this.open) {
        this.open = false;
      }
    });
  }

  ngOnDestroy() {
    this.active = false;
  }

  ngOnChanges(changes?: any) {
    this.messages = this.call.messages.slice(-4);
    if (this.call instanceof Call) {
      const minutes: number = Math.floor((<Call>this.call).callDuration / 60);
      const seconds: number = (<Call>this.call).callDuration - (minutes * 60);
      this.calculateFormattedDuration(minutes, seconds);
    }
    this.route.queryParams.takeWhile(() => {
      return this.active;
    }).subscribe((params: any) => {
      if (params.c === this.call.id) {
        this.changeExpandedState();
      }
    });
  }

  private calculateFormattedDuration(minutes: number, seconds: number) {
    if ((<Call>this.call).callStatus === 'ANSWERED') {
      this.formattedDuration = '';
      if (minutes > 0) {
        this.formattedDuration += `${minutes}m `;
      }
      if (seconds > 0) {
        this.formattedDuration += `${seconds}s`;
      }
    }
  }

  changeExpandedState() {
    if (!this.open) {
      this.trackingService.track(TrackingService.PHONE_LEAD_OPENED, {lead_id: this.call.id});
      this.eventService.emit(EventService.CLOSE_EXPANDED_CALLS);
    }
    this.open = !this.open;
  }

  @HostListener('@remove.done') onAnimationDone($event: Event) {
    if (this.archived) {
        this.callService.stream();
    }
  }
}
