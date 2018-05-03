import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../core/payments/payment.service';
import { Pack } from '../../../core/payments/pack';
import { Packs } from '../../../core/payments/payment.interface';
import * as _ from 'lodash';
import { isArray } from 'util';

@Component({
  selector: 'tsl-checkout-extras-pro',
  templateUrl: './checkout-extras-pro.component.html',
  styleUrls: ['./checkout-extras-pro.component.scss']
})
export class CheckoutExtrasProComponent implements OnInit {
  packs: Array<any> = [];

  constructor(private paymentService: PaymentService) { }

  ngOnInit() {
    this.paymentService.getPacks().subscribe((packs: Packs) => {
      this.preparePacks(packs);
    });
  }

  private preparePacks(packs: Packs): void {
    let packObj = null;
    _.map(packs, (PacksList: Pack[]) => {
      PacksList.map((pack: Pack) => {
        const quantityExists = this.packs.find((packFinder: Pack) => pack.quantity === packFinder.quantity);
        if (quantityExists) {
          packObj = quantityExists;
        } else {
          packObj = { quantity: pack.quantity, packs: [] };
          this.packs.push(packObj);
        }
        packObj.packs.push(pack);
      });
    });

    this.packs = _.orderBy(this.packs, 'quantity');
    console.log('preparePacks', this.packs);
  }
}
