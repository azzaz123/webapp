import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FinancialCard } from '@shared/payments-card-info/financial-card';
import { FinancialCardOption } from '../../../core/payments/payment.interface';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Component({
  selector: 'tsl-stripe-card-selection',
  templateUrl: './stripe-card-selection.component.html',
  styleUrls: ['./stripe-card-selection.component.scss'],
})
export class StripeCardSelectionComponent implements OnInit {
  @Output() hasCard: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() handleSelectExistingCard: EventEmitter<FinancialCardOption> = new EventEmitter<FinancialCardOption>();
  public financialCards: FinancialCardOption[];
  public card: string = '';
  private _model: boolean = false;
  private notFoundMsg = '';
  constructor(private stripeService: StripeService, private i18nService: I18nService) {}
  ngOnInit() {
    this.stripeService.getCards().subscribe(
      (stripeCards: FinancialCard[]) => {
        this.financialCards = stripeCards.map((financialCard: FinancialCard) => this.toSelectOptions(financialCard));
        this.hasCard.emit(this.financialCards.length > 0);
      },
      () => {
        this.hasCard.emit(false);
      }
    );
    this.notFoundMsg = this.i18nService.translate(TRANSLATION_KEY.NO_RESULTS_FOUND);
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
    this.handleSelectExistingCard.emit(selectedCard);
  }
  private onModelChange: any = () => {};
  private onTouched: any = () => {};

  private toSelectOptions(card: FinancialCard): FinancialCardOption {
    return {
      value: card.number.toString(),
      label: card.number,
      expire_date: card.expire_date,
      id: card.id,
      number: card.number,
      favorite: card.favorite,
      stripeCard: card.stripeCard,
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
}
