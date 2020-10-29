import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, ViewBannedUserChatPopUp } from 'app/core/analytics/analytics-constants';
import { AnalyticsService } from 'app/core/analytics/analytics.service';

@Component({
  selector: 'tsl-malicious-conversation-modal',
  templateUrl: './malicious-conversation-modal.component.html',
  styleUrls: ['./malicious-conversation-modal.component.scss']
})
export class MaliciousConversationModalComponent implements OnInit {
  public chatContext: ViewBannedUserChatPopUp;

  constructor(public activeModal: NgbActiveModal,
              private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.trackViewMaliciousModal();
  }

  private trackViewMaliciousModal(): void {
    const event: AnalyticsPageView<ViewBannedUserChatPopUp> = {
      name: ANALYTICS_EVENT_NAMES.ViewBannedUserChatPopUp,
      attributes: this.chatContext
    };
    this.analyticsService.trackPageView(event);
  }
}
