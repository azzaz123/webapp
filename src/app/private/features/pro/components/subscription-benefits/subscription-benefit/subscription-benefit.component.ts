import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-subscription-benefit',
  templateUrl: './subscription-benefit.component.html',
  styleUrls: ['./subscription-benefit.component.scss'],
})
export class SubscriptionBenefitComponent {
  @Input() img: string;
  @Input() title: string;
  @Input() description: string;
  @Input() leftAligment: boolean;

  constructor() {}
}
