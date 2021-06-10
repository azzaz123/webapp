import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FinancialCard } from './financial-card';
import { finalize } from 'rxjs/operators';
import { NoCardModalComponent } from 'app/shared/modals/no-card-modal/no-card-modal.component';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { COLORS } from '@core/colors/colors-constants';

@Component({
  selector: 'tsl-credit-card-info',
  templateUrl: './credit-card-info.component.html',
  styleUrls: ['./credit-card-info.component.scss'],
})
export class CreditCardInfoComponent {
  public loading = false;

  @Input() financialCard: FinancialCard;
  @Input() hideDelete: boolean;
  @Input() hideEdit: boolean;
  @Input() error: boolean;
  @Output() onSetChangeCard: EventEmitter<Event> = new EventEmitter();
  @Output() onDeleteStripeCard: EventEmitter<FinancialCard> = new EventEmitter();

  constructor(private modalService: NgbModal, private stripeService: StripeService, private i18nService: I18nService) {}

  public checkDelete(e: Event) {
    e.stopPropagation();
    if (this.financialCard.invoices_default) {
      let modalRef: NgbModalRef = this.modalService.open(NoCardModalComponent, {
        windowClass: 'review',
      });
      modalRef.result.then((action: string) => {
        modalRef = null;
        if (action === 'deleteCardModal') {
          this.stripeService
            .deleteCard(this.financialCard.id)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe(() => {
              this.onDeleteStripeCard.emit(this.financialCard);
              this.financialCard = null;
            });
        }
      });
    } else {
      this.deleteStripeCard();
    }
  }

  public deleteStripeCard() {
    const modalRef = this.modalService.open(ConfirmationModalComponent);

    modalRef.componentInstance.properties = {
      title: this.i18nService.translate(TRANSLATION_KEY.DELETE_CARD_TITLE),
      description: this.i18nService.translate(TRANSLATION_KEY.DELETE_CARD_DESCRIPTION),
      confirmMessage: this.i18nService.translate(TRANSLATION_KEY.DELETE_BUTTON),
      confirmColor: COLORS.NEGATIVE_MAIN,
    };

    modalRef.componentInstance.financialCard = this.financialCard;
    modalRef.result.then(
      () => {
        this.loading = true;
        this.stripeService
          .deleteCard(this.financialCard.id)
          .pipe(finalize(() => (this.loading = false)))
          .subscribe(() => {
            this.onDeleteStripeCard.emit(this.financialCard);
            this.financialCard = null;
            this.loading = false;
          });
      },
      () => {}
    );
  }

  public changeStripeCard(e: Event) {
    this.onSetChangeCard.emit(e);
  }
}
