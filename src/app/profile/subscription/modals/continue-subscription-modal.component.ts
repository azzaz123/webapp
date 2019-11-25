import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionsResponse } from '../../../core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../../../core/i18n/i18n.service';

@Component({
  selector: 'tsl-continue-subscription-modal',
  templateUrl: './continue-subscription-modal.component.html',
  styleUrls: ['./continue-subscription-modal.component.scss']
})

export class ContinueSubscriptionModalComponent {
    public loading = false;
    public subscription: SubscriptionsResponse;
  
    constructor(public activeModal: NgbActiveModal,
                public subscriptionsService: SubscriptionsService,
                private toastr: ToastrService,
                private i18n: I18nService) {
    }

  public close() {
      this.activeModal.close('continue');
  }

  public continueSubscription() {
    this.loading = true;
    this.subscriptionsService.continueSubscription(this.subscription.selected_tier_id).subscribe(() => {
      this.loading = false;
      this.close();
      this.toastr.success(this.i18n.getTranslations('continueSubscriptionSuccessTitle') + ' ' + this.i18n.getTranslations('continueSubscriptionSuccessBody'));
    }, () => {
      this.loading = false;
      this.close();
      this.toastr.error(this.i18n.getTranslations('continueSubscriptionErrorTitle') + ' ' + this.i18n.getTranslations('continueSubscriptionErrorBody'));
    });
    
  }

}
