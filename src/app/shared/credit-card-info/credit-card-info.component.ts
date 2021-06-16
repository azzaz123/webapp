import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { BRAND_CARDS, BRAND_CARDS_WITH_SVG } from './credit-card-info.enum';
import { FinancialCard } from './financial-card';

@Component({
  selector: 'tsl-credit-card-info',
  templateUrl: './credit-card-info.component.html',
  styleUrls: ['./credit-card-info.component.scss'],
})
export class CreditCardInfoComponent implements OnChanges {
  @Input() brand: string;
  @Input() numberCard: string;
  @Input() expireDate: Date;
  @Input() ownerName: string;
  @Input() error: boolean;
  @Input() hideEdit: boolean;
  @Input() hideDelete: boolean;

  @Output() changeCardClick: EventEmitter<Event> = new EventEmitter();
  @Output() deleteCardClick: EventEmitter<FinancialCard> = new EventEmitter();

  public creditCardBrandSrc: string;
  public isCardWithIcon: boolean;

  constructor() {}

  ngOnChanges() {
    this.isCardWithIcon = BRAND_CARDS_WITH_SVG.includes(this.brand as BRAND_CARDS);

    this.checkCreditCardBrandSrc();
  }

  private checkCreditCardBrandSrc(): void {
    const brandCard = this.isCardWithIcon ? `card-${this.brand}` : 'card';
    this.creditCardBrandSrc = `/assets/icons/${brandCard}.svg`;
  }
}
