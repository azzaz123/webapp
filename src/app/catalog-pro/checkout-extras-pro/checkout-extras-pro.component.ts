import { Component, OnInit, ViewChild } from '@angular/core';
import { map, orderBy } from 'lodash-es';
import { FormGroup } from '@angular/forms';
import { PaymentService } from '../../core/payments/payment.service';
import { Packs } from '../../core/payments/payment.interface';
import { Pack } from '../../core/payments/pack';

@Component({
  selector: 'tsl-checkout-extras-pro',
  templateUrl: './checkout-extras-pro.component.html',
  styleUrls: ['./checkout-extras-pro.component.scss']
})
export class CheckoutExtrasProComponent implements OnInit {
  packs: Array<any> = [];
  billingInfoFormEnabled = false;
  billingInfoForm: FormGroup;
  
  constructor(private paymentService: PaymentService) { }

  ngOnInit() {
    this.paymentService.getPacks().subscribe((packs: Packs) => {
      this.preparePacks(packs);
    });
  }

  public onBillingInfoChange(billingInfoForm: FormGroup) {
    this.billingInfoForm = billingInfoForm;
  }

  public onBillingInfoMissing(billingInfoMissing: boolean) {
    this.billingInfoFormEnabled = billingInfoMissing;
  }

  private preparePacks(packs: Packs): void {
    let packObj = null;
    map(packs, (PacksList: Pack[]) => {
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

    this.packs = orderBy(this.packs, 'quantity');
  }
}
