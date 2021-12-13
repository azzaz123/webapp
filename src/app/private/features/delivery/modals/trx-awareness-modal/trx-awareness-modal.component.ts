import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tsl-trx-awareness-modal',
  templateUrl: './trx-awareness-modal.component.html',
  styleUrls: ['./trx-awareness-modal.component.scss'],
})
export class TRXAwarenessModalComponent implements OnInit {
  public readonly TRX_AWARENESS_LOTTIE =
    'https://prod-delivery-resources.s3.eu-west-1.amazonaws.com/transaction-tracking-screen/shipping_status_in_transit_animation.json';

  constructor() {}

  ngOnInit(): void {}
}
