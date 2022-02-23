import { finalize } from 'rxjs/operators';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { ErrorsService } from '@core/errors/errors.service';
import { CreditInfo, FinancialCardOption } from '@core/payments/payment.interface';
import { PACKS_TYPES } from '@core/payments/pack';
import { BUMP_TYPE } from '@api/core/model/bumps/bump.interface';
import { ICON_TYPE } from '@shared/pro-badge/pro-badge.interface';
import { VisibilityApiService } from '@api/visibility/visibility-api.service';
import { BumpRequestSubject, SelectedProduct } from '@api/core/model/bumps/item-products.interface';

@Component({
  selector: 'tsl-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  @Input() creditInfo: CreditInfo;
  @Input() selectedItems: SelectedProduct[];
  @Output() confirmAction: EventEmitter<void> = new EventEmitter<void>();
  @Output() errorAction: EventEmitter<BumpRequestSubject[]> = new EventEmitter<BumpRequestSubject[]>();

  public hasSavedCards = true;
  public isNewCard = false;
  public loading: boolean;
  public card: FinancialCardOption | stripe.elements.Element;
  public readonly BUMP_TYPES = BUMP_TYPE;
  public readonly PACK_TYPES = PACKS_TYPES;
  public readonly ICON_TYPE = ICON_TYPE;

  constructor(private errorService: ErrorsService, private visibilityService: VisibilityApiService) {}

  public checkout(): void {
    if (this.loading) {
      return;
    }
    if (this.totalToPay > 0 && !this.card) {
      this.errorService.i18nError(TRANSLATION_KEY.NO_CARD_SELECTED_ERROR);
      return;
    }

    this.loading = true;

    this.visibilityService
      .buyBumps(this.selectedItems, this.hasSavedCards, this.isNewCard, this.card)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(([...next]) => {
        const errors = next.filter((value) => value?.hasError);
        errors.length ? this.error(errors) : this.success();
      });
  }

  public addNewCard(): void {
    this.isNewCard = true;
    this.card = null;
  }

  public removeNewCard(): void {
    this.isNewCard = false;
    this.card = null;
  }

  public setSavedCard(selectedCard: FinancialCardOption): void {
    this.setCardInfo(selectedCard);
  }

  public setHasCards(hasCards: boolean): void {
    this.hasSavedCards = hasCards;
    this.isNewCard = !hasCards;
    if (this.isNewCard) {
      this.addNewCard();
    }
  }

  public setCardInfo(card: FinancialCardOption | stripe.elements.Element): void {
    this.card = card;
  }

  private success(): void {
    this.confirmAction.emit();
  }

  private error(errors: BumpRequestSubject[]): void {
    this.errorAction.emit(errors);
  }

  get totalToPay(): number {
    if (!this.selectedItems?.length || !this.creditInfo) {
      return 0;
    }
    const total = this.selectedItems.reduce((a, b) => (b.isFree ? a : +b.duration.market_code + a), 0);
    const totalCreditsToPay: number = total * this.creditInfo.factor;
    if (totalCreditsToPay < this.creditInfo.credit) {
      return 0;
    } else {
      return total - this.creditInfo.credit / this.creditInfo.factor;
    }
  }
}
