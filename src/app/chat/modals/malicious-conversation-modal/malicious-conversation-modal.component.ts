import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnalyticsPageView, ANALYTICS_EVENT_NAMES, SCREEN_IDS, ViewBannedUserChatPopUp } from 'app/core/analytics/analytics-constants';
import { AnalyticsService } from 'app/core/analytics/analytics.service';

@Component({
  selector: 'tsl-malicious-conversation-modal',
  templateUrl: './malicious-conversation-modal.component.html',
  styleUrls: ['./malicious-conversation-modal.component.scss']
})
export class MaliciousConversationModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
              private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    // this.trackViewMaliciousModal();
  }

  private trackViewMaliciousModal(chatContext: ViewBannedUserChatPopUp): void {
    // TODO: changes atr for chatContext object 		Date: 2020/10/20
    const event: AnalyticsPageView<ViewBannedUserChatPopUp> = {
      name: ANALYTICS_EVENT_NAMES.ViewBannedUserChatPopUp,
      attributes: chatContext
    };
    this.analyticsService.trackPageView(event);
  }
}
