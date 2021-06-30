import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { BRAND_CARDS, BRAND_CARDS_WITH_SVG } from './payments-card-info.enum';
import { FinancialCard } from './financial-card';

@Component({
  selector: 'tsl-payments-card-info',
  templateUrl: './payments-card-info.component.html',
  styleUrls: ['./payments-card-info.component.scss'],
})
export class PaymentsCardInfoComponent implements OnChanges {
  @Input() brand: string;
  @Input() numberCard: string;
  @Input() expireDate: string;
  @Input() ownerName: string;
  @Input() error: boolean;
  @Input() hideEdit: boolean;
  @Input() hideDelete: boolean;
  @Input() isBankAccount: boolean;

  @Output() changeCardClick: EventEmitter<Event> = new EventEmitter();
  @Output() deleteCardClick: EventEmitter<FinancialCard> = new EventEmitter();

  public creditCardBrandSrc: string;
  public isCardWithIcon: boolean;
  public aliasNumber: string;

  constructor() {}

  ngOnChanges() {
    this.updateAlias();
    this.isCardWithIcon = BRAND_CARDS_WITH_SVG.includes(this.brand as BRAND_CARDS);
    this.checkCreditCardBrandSrc();
  }

  private updateAlias(): void {
    const stars = this.isBankAccount ? '****' : '**** **** ****';
    this.aliasNumber = `${stars} ${this.numberCard}`;
  }

  private checkCreditCardBrandSrc(): void {
    const brandCard = this.isCardWithIcon ? `card-${this.brand}` : 'card';
    this.creditCardBrandSrc = `/assets/icons/${brandCard}.svg`;
  }
}
