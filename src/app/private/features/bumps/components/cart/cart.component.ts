import { finalize } from 'rxjs/operators';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { ErrorsService } from '@core/errors/errors.service';
import { CreditInfo, FinancialCardOption } from '@core/payments/payment.interface';
import { PACKS_TYPES } from '@core/payments/pack';
import { BUMP_TYPE } from '@api/core/model/bumps/bump.interface';
import { ICON_TYPE } from '@shared/pro-badge/pro-badge.interface';
import { VisibilityApiService } from '@api/visibility/visibility-api.service';
import { SelectedProduct } from '@api/core/model/bumps/item-products.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'tsl-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  @Input() creditInfo: CreditInfo;
  @Input() selectedItems: SelectedProduct[];
  @Output() confirmAction: EventEmitter<void> = new EventEmitter<void>();

  public hasSavedCard = true;
  public loading: boolean;
  public card: any;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
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
      .buyBumps(this.selectedItems, this.hasSavedCard, this.savedCard, this.card)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(([...next]) => {
        const errors = next.filter((value) => value.hasError);
        if (errors.length) {
          if (errors[0].error instanceof HttpErrorResponse) {
            this.errorService.show(errors[0].error);
          } else {
            this.errorService.i18nError(TRANSLATION_KEY.BUMP_ERROR);
          }
        } else {
          this.success();
        }
      });
  }

  public addNewCard(): void {
    this.showCard = true;
    this.savedCard = false;
  }

  public removeNewCard(): void {
    this.showCard = false;
    this.savedCard = true;
  }

  public setSavedCard(selectedCard: FinancialCardOption): void {
    this.showCard = false;
    this.savedCard = true;
    this.selectedCard = true;
    this.setCardInfo(selectedCard);
  }

  public hasCard(hasCard: boolean): void {
    this.hasSavedCard = hasCard;
    if (!hasCard) {
      this.addNewCard();
    }
  }

  public setCardInfo(card: any): void {
    this.card = card;
  }

  private success(): void {
    this.confirmAction.emit();
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
