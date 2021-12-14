import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { DELIVERY_PATH_PARAMS } from '@private/features/delivery/delivery-routing-constants';
import { TransactionTrackingHeader } from '@api/core/model/delivery/transaction/tracking';

import * as JsBarcode from 'jsbarcode';

const barcodeType: string = 'img';

const options = {
  format: 'CODE128',
};

@Component({
  selector: 'tsl-transaction-tracking-barcode',
  templateUrl: './transaction-tracking-barcode.component.html',
  styleUrls: ['./transaction-tracking-barcode.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTrackingBarcodeComponent implements OnInit {
  @ViewChild('barcode', { static: true }) barcodeElementRef: ElementRef;

  public header: TransactionTrackingHeader = { title: '' };

  constructor(private route: ActivatedRoute, private renderer: Renderer2) {}

  ngOnInit(): void {
    const barcode = this.route.snapshot.paramMap.get(DELIVERY_PATH_PARAMS.BARCODE);
    this.generateBarcode(barcode);
  }

  private generateBarcode(barcode: string): void {
    if (!barcode) {
      return;
    }
    const element = this.renderer.createElement(barcodeType);

    JsBarcode(element, barcode, options);
    this.renderer.appendChild(this.barcodeElementRef.nativeElement, element);
  }
}
