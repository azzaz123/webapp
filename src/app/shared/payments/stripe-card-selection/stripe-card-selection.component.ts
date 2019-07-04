import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FinancialCard } from '../../profile/credit-card-info/financial-card';
import { FinancialCardOption } from '../../../core/payments/payment.interface';
import { I18nService } from '../../../core/i18n/i18n.service';

@Component({
  selector: 'tsl-stripe-card-selection',
  templateUrl: './stripe-card-selection.component.html',
  styleUrls: ['./stripe-card-selection.component.scss']
})
export class StripeCardSelectionComponent implements OnInit {

  private _model: boolean = false;
  public financialCards: FinancialCardOption[];
  public card: string = '';
  private notFoundMsg = '';
  @Output() hasStripeCard: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onSelectExistingCard: EventEmitter<FinancialCardOption> = new EventEmitter<FinancialCardOption>();

  private onModelChange: any = () => {};
  private onTouched: any = () => {};

  constructor(
    private stripeService: StripeService,
    private i18nservice: I18nService
  ) { }

  ngOnInit() {
    this.stripeService.getCards().subscribe((stripeCards: FinancialCard[]) => {
      this.financialCards = stripeCards.map((financialCard: FinancialCard) => this.toSelectOptions(financialCard));
      this.hasStripeCard.emit(!!this.financialCards);
    }, () => {
      this.hasStripeCard.emit(false);
    });
    this.notFoundMsg = this.i18nservice.getTranslations('noResultsFound');
  }

  private toSelectOptions(card: FinancialCard): FinancialCardOption {
    return {
      value: card.number.toString(),
      label: card.number,
      expire_date: card.expire_date,
      id: card.id,
      number: card.number,
      favorite: card.favorite,
      stripeCard: card.stripeCard
    };
  }

  public get model(): boolean {
    return this._model;
  }

  public set model(val: boolean) {
    this._model = val;
    this.onModelChange(val);
    this.onTouched();
  }

  public registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  public writeValue(value: boolean): void {
    this.model = value;
  }

  public registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  public setFinancialCard(selectedCard: FinancialCardOption) {
    this.onSelectExistingCard.emit(selectedCard);
  }

}
