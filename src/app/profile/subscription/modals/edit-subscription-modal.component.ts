import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StripeService } from '../../../core/stripe/stripe.service';
import { PaymentMethodResponse } from '../../../core/payments/payment.interface';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { SubscriptionsResponse, Tier } from '../../../core/subscriptions/subscriptions.interface';

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
              private subscriptionsService: SubscriptionsService) {
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

  public updateSubscription(paymentMethod: PaymentMethodResponse) {
    this.loading = true;
   // update subs endpoint
  }

  public selectListingLimit(tier: Tier): void {
    this.selectedTier = tier;
  }

}
