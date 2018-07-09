import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../core/payments/payment.service';
import { Pack } from '../core/payments/pack';

@Component({
  selector: 'tsl-wallacoins',
  templateUrl: './wallacoins.component.html',
  styleUrls: ['./wallacoins.component.scss']
})
export class WallacoinsComponent implements OnInit {

  public packs: Pack[];

  constructor(private paymentService: PaymentService) { }

  ngOnInit() {
    this.paymentService.getCreditsPacks().subscribe((packs: Pack[]) => {
      this.packs = packs;
      console.log(packs);
    });
  }

}
