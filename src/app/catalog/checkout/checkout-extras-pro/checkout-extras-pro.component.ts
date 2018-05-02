import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../core/payments/payment.service';
import { Pack } from '../../../core/payments/pack';
import { Packs } from '../../../core/payments/payment.interface';
import * as _ from 'lodash';

@Component({
  selector: 'tsl-checkout-extras-pro',
  templateUrl: './checkout-extras-pro.component.html',
  styleUrls: ['./checkout-extras-pro.component.scss']
})
export class CheckoutExtrasProComponent implements OnInit {
  packs: any = {};

  constructor(private paymentService: PaymentService) { }

  ngOnInit() {
    this.paymentService.getPacks().subscribe((packs: Packs) => {
      this.preparePacks(packs);
      console.log('packs', packs);
    });
  }

  private preparePacks(packs: Packs): void {
    _.map(packs, (PacksList: Pack[]) => {
      PacksList.map((pack: Pack) => {
        if (!this.packs[pack.quantity]) {
          this.packs[pack.quantity] = [];
        }
        this.packs[pack.quantity].push(pack);
      });
    });
    console.log('preparePacks', this.packs);
  }
}
