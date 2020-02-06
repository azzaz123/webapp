import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionsResponse, Tier } from '../../../core/subscriptions/subscriptions.interface';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../../../core/i18n/i18n.service';
import { CancelSubscriptionModalComponent } from './cancel-subscription-modal.component';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import {
  AnalyticsPageView,
  ViewEditSubscriptionPlan,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS
} from '../../../core/analytics/analytics-constants';

@Component({
  selector: 'tsl-edit-subscription-modal',
  templateUrl: './edit-subscription-modal.component.html',
  styleUrls: ['./edit-subscription-modal.component.scss']
})

export class EditSubscriptionModalComponent implements OnInit {

  public isLast: boolean;
  public card: any;
  public action: string;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
  public selectedTier: Tier;
  public currentTier: Tier;
  public loading = false;
  public isPaymentError = false;
  public isRetryInvoice = false;
  public subscription: SubscriptionsResponse;

  constructor(public activeModal: NgbActiveModal,
              public subscriptionsService: SubscriptionsService,
              private toastr: ToastrService,
              private i18n: I18nService,
              private modalService: NgbModal,
              private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    this.selectedTier = this.subscription.selected_tier;
    this.currentTier = this.selectedTier;

    const pageView: AnalyticsPageView<ViewEditSubscriptionPlan> = {
      name: ANALYTICS_EVENT_NAMES.ViewEditSubscriptionPlan,
      attributes: {
        screenId: SCREEN_IDS.SubscriptionManagment
      }
    };

    this.analyticsService.trackPageView(pageView);
  }

  public close() {
    this.activeModal.close('update');
  }

  public editSubscription() {
    this.loading = true;
    this.subscriptionsService.editSubscription(this.subscription, this.selectedTier.id).subscribe((response) => {
      if (response.status === 202) {
          this.toastr.success(this.i18n.getTranslations('editSubscriptionSuccessTitle') + ' ' + this.i18n.getTranslations('editSubscriptionSuccessBody'));
          this.loading = false;
      } else {
        this.loading = false;
        this.toastr.error(this.i18n.getTranslations('editSubscriptionErrorTitle') + ' ' + this.i18n.getTranslations('editSubscriptionErrorBody'));
      }
      this.close();
    });
  }

  public selectListingLimit(tier: Tier): void {
    this.selectedTier = tier;
  }

  public isCurrentTier(): boolean {
    return this.selectedTier && this.currentTier ? this.currentTier === this.selectedTier : false;
  }

  public cancelSubscription() {
    this.close();
    const modal = CancelSubscriptionModalComponent
    let modalRef: NgbModalRef = this.modalService.open(modal, {windowClass: 'review'});
    modalRef.componentInstance.subscription = this.subscription;
    modalRef.result.then((result: string) => {
      modalRef = null;
      if (result !== 'cancel') {
        this.toastr.success(this.i18n.getTranslations('cancelSubscriptionSuccessTitle') + ' ' + this.i18n.getTranslations('cancelSubscriptionSuccessBody'));
      }
    }, () => {});
  }

}
