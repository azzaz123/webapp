import { Component, OnInit, Input } from '@angular/core';
import { Pack } from '../../../../core/payments/pack';

@Component({
  selector: 'tsl-checkout-extras-pro-item',
  templateUrl: './checkout-extras-pro-item.component.html',
  styleUrls: ['./checkout-extras-pro-item.component.scss']
})
export class CheckoutExtrasProItemComponent implements OnInit {

  @Input() pack: Pack;

  constructor() { }

  ngOnInit() {
    console.log('hwllo', this.pack);
  }

}
