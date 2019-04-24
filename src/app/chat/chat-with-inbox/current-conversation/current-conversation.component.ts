import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { InboxMessage } from '../message/inbox-message';
import { InboxConversation } from '../inbox/inbox-conversation/inbox-conversation';
import { EventService } from '../../../core/event/event.service';
import { RealTimeService } from '../../../core/message/real-time.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { ReportUserComponent } from '../../modals/report-user/report-user.component';
import { UserService } from '../../../core/user/user.service';
import { I18nService } from '../../../core/i18n/i18n.service';

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
    private modalService: NgbModal,
    private toastr: ToastrService,
    private trackingService: TrackingService,
    private userService: UserService,
    private i18n: I18nService,
    private realTime: RealTimeService) {
  }

  private newMessageSubscription: Subscription;
  private _emptyInbox: boolean;

  public momentConfig: any = {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: 'dddd, D MMM',
    lastWeek: 'dddd, D MMM',
    nextWeek: 'dddd, D MMM',
    sameElse: 'dddd, D MMM'
  };

  get emptyInbox(): boolean {
    return this.conversationsTotal === 0;
  }

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
    if (this.currentConversation && this.currentConversation.id === message.thread) {
      Visibility.onVisible(() => {
        setTimeout(() => {
          this.realTime.sendRead(this.currentConversation.user.id, this.currentConversation.id);
        }, 1000);
      });
    }
  }

  public reportUserAction(): void {
    this.modalService.open(ReportUserComponent, {windowClass: 'report'}).result.then((result: any) => {
      this.userService.reportUser(
        this.currentConversation.user.id,
        this.currentConversation.item.id,
        result.message,
        result.reason,
        this.currentConversation.id
      ).subscribe(() => {
        this.trackingService.track(TrackingService.USER_PROFILE_REPPORTED,
          {user_id: this.currentConversation.user.id, reason_id: result.reason});
        this.toastr.success(this.i18n.getTranslations('reportUserSuccess'));
      });
    }, () => {
    });
  }
}
