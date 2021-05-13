import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FinancialCardOption } from '../../../core/payments/payment.interface';
import { PAYMENT_RESPONSE_STATUS } from 'app/core/payments/payment.service';
import { EventService } from 'app/core/event/event.service';
import { StripeService } from 'app/core/stripe/stripe.service';
import { finalize } from 'rxjs/operators';
import { ConfirmCardModalComponent } from '../confirm-card-modal/confirm-card-modal.component';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Component({
  selector: 'tsl-change-card-modal',
  templateUrl: './change-card-modal.component.html',
  styleUrls: ['./change-card-modal.component.scss'],
})
export class ChangeCardModalComponent implements OnInit {
  public mainLoading: boolean = true;
  public loading: boolean;
  public card: any;
  public hasSavedCard = true;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
  public newLoading = false;
  errorService: any;

  constructor(
    public activeModal: NgbActiveModal,
    private eventService: EventService,
    private stripeService: StripeService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.eventService.subscribe('paymentResponse', (response) => {
      this.managePaymentResponse(response);
    });
  }

  public hasCard(hasCard: boolean) {
    this.mainLoading = false;
    this.hasSavedCard = hasCard;
    if (!hasCard) {
      this.addNewCard();
    }
  }

  public setCardInfo(card: any) {
    this.card = card;
  }

  public addNewCard() {
    this.showCard = true;
    this.savedCard = false;
  }

  public removeNewCard() {
    this.showCard = false;
    this.savedCard = true;
  }

  public setSavedCard(selectedCard: FinancialCardOption) {
    this.showCard = false;
    this.savedCard = true;
    this.selectedCard = true;
    this.setCardInfo(selectedCard);
  }

  public setDefaultCard(paymentMethod: string) {
    if (paymentMethod) {
      this.stripeService
        .setDefaultCard(paymentMethod)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(
          () => this.activeModal.close(this.card),
          // FIXME: 'setDefaultCardError' has no value. Need to find one for it
          // () => this.errorService.i18nError('setDefaultCardError')
          () => this.errorService.i18nError(TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE)
        );
    } else {
      this.activeModal.close(this.card.id);
    }
  }

  public setNewDefaultCard(paymentIntent: any) {
    this.setDefaultCard(paymentIntent.payment_method);
  }

  public setExistingDefaultCard() {
    if (!this.selectedCard) return;
    let modalRef: NgbModalRef = this.modalService.open(ConfirmCardModalComponent, { windowClass: 'review' });
    modalRef.componentInstance.financialCard = this.card.stripeCard;
    modalRef.result.then((action: string) => {
      modalRef = null;
      if (action === 'changeCardModal') {
        this.confirmCardChange();
      }
    });
  }

  private confirmCardChange() {
    this.newLoading = true;

    this.stripeService.getSetupIntent().subscribe((clientSecret: any) => {
      this.stripeService
        .createDefaultCard(clientSecret.setup_intent, this.card.id)
        .then((response: any) => {
          if (response.setupIntent.status && response.setupIntent.status.toUpperCase() === PAYMENT_RESPONSE_STATUS.SUCCEEDED) {
            this.setDefaultCard(response.setupIntent.payment_method);
          } else {
            this.newLoading = false;
          }
        })
        .catch(() => (this.newLoading = false));
    });
  }

  private managePaymentResponse(paymentResponse: string): void {
    switch (paymentResponse && paymentResponse.toUpperCase()) {
      case PAYMENT_RESPONSE_STATUS.SUCCEEDED: {
        this.activeModal.close('success');
        break;
      }
      default: {
        this.activeModal.close('error');
        break;
      }
    }
  }
}
