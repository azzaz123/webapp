import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import { AnalyticsPageView, ViewSuccessSubscriptionPayment, ANALYTICS_EVENT_NAMES } from '../../../core/analytics/analytics-constants';

@Component({
  selector: 'tsl-payment-success-modal',
  templateUrl: './payment-success-modal.component.html',
  styleUrls: ['./payment-success-modal.component.scss']
})

export class PaymentSuccessModalComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal, private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    const pageView: AnalyticsPageView<ViewSuccessSubscriptionPayment> = {
      name: ANALYTICS_EVENT_NAMES.ViewSuccessSubscriptionPayment,
      attributes: {
        screenId: 205
      }
    };
    this.analyticsService.trackPageView(pageView);
  }

  public close() {
      this.activeModal.close();
  }

}
