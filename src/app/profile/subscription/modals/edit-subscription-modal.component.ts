import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StripeService } from '../../../core/stripe/stripe.service';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { SubscriptionsResponse, Tier } from '../../../core/subscriptions/subscriptions.interface';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../../../core/i18n/i18n.service';
import { EventService } from '../../../core/event/event.service';

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
  public isStripe: boolean;
  public loading = false;
  public isPaymentError = false;
  public currentSlide: string;
  public isRetryInvoice = false;
  public subscription: SubscriptionsResponse;
  public selectedPlanId: string;

  constructor(public activeModal: NgbActiveModal,
              private stripeService: StripeService,
              private subscriptionsService: SubscriptionsService,
              private toastr: ToastrService,
              private i18n: I18nService,
              private eventService: EventService) {
  }

  ngOnInit() {
    this.selectedTier = this.subscription.selected_tier;
    this.selectedPlanId = this.subscription.selected_tier.id;
    
    this.stripeService.isPaymentMethodStripe$().subscribe(val => {
      this.isStripe = val;
    });
  }

  public close() {
      this.activeModal.close();
  }

  public updateSubscription() {
    this.loading = true;
   // update subs endpoint
   this.close();
   this.toastr.success(this.i18n.getTranslations('editSubscriptionSuccess'));
   this.eventService.emit('subscriptionChange');
  }

  public selectListingLimit(tier: Tier): void {
    this.selectedTier = tier;
  }

}
