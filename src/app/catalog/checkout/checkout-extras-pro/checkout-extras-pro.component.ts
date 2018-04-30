import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../core/payments/payment.service';
import { Packs } from '../../../core/payments/payment.interface';

@Component({
  selector: 'tsl-checkout-extras-pro',
  templateUrl: './checkout-extras-pro.component.html',
  styleUrls: ['./checkout-extras-pro.component.scss']
})
export class CheckoutExtrasProComponent implements OnInit {

  packs: Packs;

  constructor(private paymentService: PaymentService) { }

  ngOnInit() {
    this.paymentService.getPacks().subscribe((packs: Packs) => {
      this.packs = packs;
      console.log('oninit', this.packs);
    });
  }
}
