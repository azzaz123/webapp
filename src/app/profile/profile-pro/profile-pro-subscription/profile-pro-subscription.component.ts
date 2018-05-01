import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../core/payments/payment.service';
import { PacksModel, PerksModel } from '../../../core/payments/payment.model';

@Component({
  selector: 'tsl-profile-pro-subscription',
  templateUrl: './profile-pro-subscription.component.html',
  styleUrls: ['./profile-pro-subscription.component.scss']
})
export class ProfileProSubscriptionComponent implements OnInit {

  public packs: PacksModel;
  public perks: PerksModel;
  public email = 'ventas.motor@wallapop.com';

  constructor(private paymentsService: PaymentService) { }

  ngOnInit() {
    this.paymentsService.getSubscriptionPacks().subscribe((packs: PacksModel) => {
      this.packs = packs;
    });
    this.paymentsService.getPerks().subscribe((perks: PerksModel) => {
      this.perks = perks;
    });
  }

}
