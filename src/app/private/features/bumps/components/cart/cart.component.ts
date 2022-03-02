import { finalize } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { ErrorsService } from '@core/errors/errors.service';
import { CreditInfo, FinancialCardOption } from '@core/payments/payment.interface';
import { BUMP_TYPE } from '@api/core/model/bumps/bump.interface';
import { ICON_TYPE } from '@shared/pro-badge/pro-badge.interface';
import { VisibilityApiService } from '@api/visibility/visibility-api.service';
import { BumpRequestSubject, SelectedProduct } from '@api/core/model/bumps/item-products.interface';
import { BumpsTrackingEventsService } from '../../services/bumps-tracking-events.service';

@Component({
  selector: 'tsl-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnChanges {
  @Input() creditInfo: CreditInfo;
  @Input() selectedItems: SelectedProduct[];
  @Output() confirmAction: EventEmitter<void> = new EventEmitter<void>();
  @Output() errorAction: EventEmitter<BumpRequestSubject[]> = new EventEmitter<BumpRequestSubject[]>();

  public hasSavedCards = true;
  public isNewCard = false;
  public loading: boolean;
  public card: FinancialCardOption | stripe.elements.Element;
  public readonly BUMP_TYPES = BUMP_TYPE;
  public readonly ICON_TYPE = ICON_TYPE;
  public totalToPay: number = 0;
  public total: number = 0;
  public creditsToPay: number = 0;

  constructor(
    private errorService: ErrorsService,
    private visibilityService: VisibilityApiService,
    private bumpsTrackingEventsService: BumpsTrackingEventsService
  ) {}

  ngOnChanges(): void {
    this.setTotals();
  }

  public checkout(): void {
    if (this.loading) {
      return;
    }
    if (this.totalToPay > 0 && !this.card) {
      this.errorService.i18nError(TRANSLATION_KEY.NO_CARD_SELECTED_ERROR);
      return;
    }

    this.loading = true;

    this.bumpsTrackingEventsService.trackPayBumpItems(this.selectedItems, this.totalToPay);

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

  private setTotals(): void {
    if (!this.selectedItems?.length || !this.creditInfo) {
      return;
    }
    this.total = this.selectedItems.reduce((a, b) => (b.isFree ? a : +b.duration.market_code + a), 0);
    if (this.creditInfo.credit) {
      this.creditsToPay = this.creditInfo.credit > this.total ? this.total : this.creditInfo.credit;
    }
    this.totalToPay = this.total - this.creditsToPay;
  }
}
