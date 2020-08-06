import { Component, OnInit, Input } from '@angular/core';
import { Invoice } from 'app/core/invoice/invoice.interface';

@Component({
  selector: 'tsl-invoice-item',
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.scss'],
})
export class InvoiceItemComponent implements OnInit {
  @Input() invoice: Invoice;

  constructor() {}

  ngOnInit() {
  }

  public downloadInvoice(invoice: Invoice) {
    console.log('invoice ', invoice);
  }
}