import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FinancialCard } from './financial-card';

@Component({
  selector: 'tsl-credit-card-info',
  templateUrl: './credit-card-info.component.html',
  styleUrls: ['./credit-card-info.component.scss'],
})
export class CreditCardInfoComponent implements OnInit {
  @Input() brand: string;
  @Input() numberCard: string;
  @Input() expireDate: Date;
  @Input() canChangeCard: boolean;

  @Output() changeCardClick: EventEmitter<Event> = new EventEmitter();
  @Output() deleteCardClick: EventEmitter<FinancialCard> = new EventEmitter();

  public creditCardBrandSrc: string;

  constructor() {}

  ngOnInit() {
    this.checkCreditCardBrandSrc();
  }

  private checkCreditCardBrandSrc(): void {
    const brandCard = this.brand !== 'visa' && this.brand !== 'mastercard' ? 'card' : `card-${this.brand}`;
    this.creditCardBrandSrc = `/assets/icons/${brandCard}.svg`;
  }
}
