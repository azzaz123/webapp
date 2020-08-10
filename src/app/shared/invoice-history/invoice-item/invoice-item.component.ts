import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Invoice } from 'app/core/invoice/invoice.interface';

@Component({
  selector: 'tsl-invoice-item',
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.scss'],
})
export class InvoiceItemComponent implements OnInit {
  
  @Input() invoice: Invoice;
  @Input() active: boolean;

  constructor() {}

  ngOnInit() {
  }

  public downloadInvoice(e: Event, invoice: Invoice) {
    e.stopPropagation();
    if (invoice.available && this.active) {
      console.log('invoice ', e, invoice);
    }
    
  }
}