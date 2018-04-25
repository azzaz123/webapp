import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../core/payments/payment.service';
import { PacksModel } from '../../../core/payments/payment.model';

@Component({
  selector: 'tsl-profile-pro-subscription',
  templateUrl: './profile-pro-subscription.component.html',
  styleUrls: ['./profile-pro-subscription.component.scss']
})
export class ProfileProSubscriptionComponent implements OnInit {

  public packs: PacksModel;
  public email = 'ventas.motor@wallapop.com';

  constructor(private paymentsService: PaymentService) { }

  ngOnInit() {
    this.paymentsService.getPacks().subscribe((packs: PacksModel) => {
      this.packs = packs;
    });
  }

}
