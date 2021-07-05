import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StripeService } from '../../../core/stripe/stripe.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { NewCardModalComponent } from '../../modals/new-card-modal/new-card-modal.component';
import { FinancialCard } from '@shared/payments-card-info/financial-card';
import { finalize } from 'rxjs/operators';
import { SubscriptionsService } from 'app/core/subscriptions/subscriptions.service';
import { SubscriptionsResponse } from 'app/core/subscriptions/subscriptions.interface';
import { ChangeCardModalComponent } from 'app/shared/modals/change-card-modal/change-card-modal.component';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { I18nService } from 'app/core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { NoCardModalComponent } from '@shared/modals/no-card-modal/no-card-modal.component';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { COLORS } from '@core/colors/colors-constants';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';

@Component({
  selector: 'tsl-stripe-cards',
  templateUrl: './stripe-cards.component.html',
  styleUrls: ['./stripe-cards.component.scss'],
})
export class StripeCardsComponent implements OnInit {
  public loading = false;
  public stripeCards: FinancialCard[];
  public subscriptionStripeCards: FinancialCard[];
  public isSubscribed: boolean;

  constructor(
    private stripeService: StripeService,
    private modalService: NgbModal,
    private errorService: ErrorsService,
    private subscriptionsService: SubscriptionsService,
    private toastService: ToastService,
    private i18n: I18nService
  ) {}

  ngOnInit() {
    this.getSubscriptions();
    this.getAllCards();
  }

  public openDeleteCardModal(financialCard: FinancialCard): void {
    if (financialCard.invoices_default) {
      this.openInvoicesDefaultModalAndDeleteCard(financialCard.id);
    } else {
      this.openStripeCardModalAndDeleteCard(financialCard.id);
    }
  }

  public addNewCard(): void {
    let modalRef: NgbModalRef = this.modalService.open(NewCardModalComponent, {
      windowClass: 'review',
    });
    modalRef.result
      .then(
        (financialCard: FinancialCard) => {
          this.loading = true;
          const existingCard = this.stripeCards.filter((stripeCard) => stripeCard.id === financialCard.id);

          if (!existingCard.length) {
            this.stripeService
              .addNewCard(financialCard.id)
              .pipe(finalize(() => (this.loading = false)))
              .subscribe(
                () => this.stripeCards.push(financialCard),
                () => this.errorService.i18nError(TRANSLATION_KEY.ADD_NEW_CARD_ERROR)
              );
          }
          modalRef = null;
        },
        () => (this.loading = false)
      )
      .catch(() => (this.loading = false));
  }

  public addNewSubscriptionCard(): void {
    let modalRef: NgbModalRef = this.modalService.open(ChangeCardModalComponent, { windowClass: 'review' });
    modalRef.result
      .then(
        () => {
          this.loading = false;
          modalRef = null;
          this.getAllCards();
          this.toastService.show({
            title: this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CONTINUE_SUCCESS_TITLE),
            text: this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CARD_SET),
            type: TOAST_TYPES.SUCCESS,
          });
        },
        () => (this.loading = false)
      )
      .catch(() => {
        this.loading = false;
        this.errorService.i18nError(TRANSLATION_KEY.SUBSCRIPTION_CARD_NOT_SET_ERROR);
      });
  }

  private openInvoicesDefaultModalAndDeleteCard(financialCardID: string): void {
    const modalRef: NgbModalRef = this.modalService.open(NoCardModalComponent, {
      windowClass: 'review',
    });

    modalRef.result.then((action: string) => {
      if (action === 'deleteCardModal') {
        this.deleteCard(financialCardID);
      }
    });
  }

  private openStripeCardModalAndDeleteCard(financialCardID: string): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent);

    modalRef.componentInstance.properties = {
      title: this.i18n.translate(TRANSLATION_KEY.DELETE_CARD_TITLE),
      description: this.i18n.translate(TRANSLATION_KEY.DELETE_CARD_DESCRIPTION),
      confirmMessage: this.i18n.translate(TRANSLATION_KEY.DELETE_BUTTON),
      confirmColor: COLORS.NEGATIVE_MAIN,
    };

    modalRef.result.then(() => {
      this.deleteCard(financialCardID);
    });
  }

  private deleteCard(financialCardID: string): void {
    this.loading = true;
    this.stripeService
      .deleteCard(financialCardID)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => {
          this.handleOnDeleteCardSucceed();
        },
        () => {
          this.errorService.i18nError(TRANSLATION_KEY.PRO_SUBSCRIPTION_CARD_DELETED_ERROR);
        }
      );
  }

  private handleOnDeleteCardSucceed(): void {
    this.toastService.show({
      title: this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CONTINUE_SUCCESS_TITLE),
      text: this.i18n.translate(TRANSLATION_KEY.PRO_SUBSCRIPTION_CARD_DELETED),
      type: TOAST_TYPES.SUCCESS,
    });
    this.getAllCards();
  }

  private getSubscriptions(): void {
    this.subscriptionsService
      .getSubscriptions(false)
      .subscribe((subscriptions) => subscriptions.map((subscription: SubscriptionsResponse) => this.isSubscriptionSelected(subscription)));
  }

  private isSubscriptionSelected(subscription: SubscriptionsResponse): void {
    if (subscription.selected_tier_id !== null) {
      this.isSubscribed = true;
    }
  }

  private getAllCards(): void {
    this.stripeService.getCards(false).subscribe(
      (stripeCards: FinancialCard[]) => {
        this.subscriptionStripeCards = stripeCards.filter((card) => card.invoices_default);
        this.stripeCards = stripeCards.filter((card) => !card.invoices_default);
      },
      () => {
        this.errorService.i18nError(TRANSLATION_KEY.STRIPE_CARDS_RETRIEVAL_ERROR);
      }
    );
  }
}
