import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionsResponse } from '../../../core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../../../core/i18n/i18n.service';
import { EventService } from '../../../core/event/event.service';

@Component({
  selector: 'tsl-cancel-subscription-modal',
  templateUrl: './cancel-subscription-modal.component.html',
  styleUrls: ['./cancel-subscription-modal.component.scss']
})

export class CancelSubscriptionModalComponent {

  public loading = false;
  public subscription: SubscriptionsResponse;

  constructor(public activeModal: NgbActiveModal,
              public subscriptionsService: SubscriptionsService,
              private toastr: ToastrService,
              private i18n: I18nService,
              private eventService: EventService) {
  }

  public close() {
    this.activeModal.close();
  }

  public cancelSubscription() {
    this.loading = true;
    this.subscriptionsService.cancelSubscription(this.subscription.selected_tier_id).subscribe((response) => {
      if (response.status === 202) {
        setTimeout(() => {
          this.toastr.success(this.i18n.getTranslations('cancelSubscriptionSuccessTitle') + ' ' + this.i18n.getTranslations('cancelSubscriptionSuccessBody'));
          this.eventService.emit('subscriptionChange');
          this.loading = false;
          this.close();
        }, 3000);
      } else {
        this.loading = false;
        this.toastr.error(this.i18n.getTranslations('cancelSubscriptionErrorTitle') + ' ' + this.i18n.getTranslations('cancelSubscriptionErrorBody'));
        this.close();
      }
    });
    
  }

}