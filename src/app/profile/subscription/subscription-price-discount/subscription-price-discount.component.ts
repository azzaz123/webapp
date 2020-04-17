import { Component, OnInit } from '@angular/core';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { SubscriptionBenefit } from '../../../core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscription-price-discount',
  templateUrl: './subscription-price-discount.component.html',
  styleUrls: ['./subscription-price-discount.component.scss']
})
export class SubscriptionPriceDiscountComponent implements OnInit {

  public loading = true;
  public priceDiscount: SubscriptionBenefit[];

  constructor(private subscriptionService: SubscriptionsService) { }

  ngOnInit() {
  }

}
