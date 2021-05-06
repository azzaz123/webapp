import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tier } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscription-purchase-footer',
  templateUrl: './subscription-purchase-footer.component.html',
  styleUrls: ['./subscription-purchase-footer.component.scss'],
})
export class SubscriptionPurchaseFooterComponent implements OnInit {
  @Input() selectedTier: Tier;
  @Input() buttonDisable: boolean;
  @Input() isFreeTrial: boolean;
  @Output() buttonPurchaseClick: EventEmitter<void> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    console.log('test', this.selectedTier);
  }

  public onClickButton() {
    this.buttonPurchaseClick.emit();
  }
}
