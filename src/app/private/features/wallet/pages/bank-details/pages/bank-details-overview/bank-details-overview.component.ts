import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BANK_DETAILS_TRANSLATIONS } from '@private/features/wallet/translations/bank-details.translations';
import { BankAccount } from '@private/features/wallet/interfaces/bank-account/bank-account-api.interface';
import { BankAccountService } from '@private/features/wallet/services/bank-account/bank-account.service';
import { BankAccountTrackingEventsService } from '@private/features/wallet/pages/bank-details/services/bank-account-tracking-events/bank-account-tracking-events.service';
import { COLORS } from '@core/colors/colors-constants';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalProperties } from '@shared/confirmation-modal/confirmation-modal.interface';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { WALLET_PATHS } from '@private/features/wallet/wallet.routing.constants';
import { WalletSharedErrorActionService } from '@private/features/wallet/shared/error-action';

import { catchError, take } from 'rxjs/operators';
import { combineLatest, Observable, throwError } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'tsl-bank-details-overview',
  templateUrl: './bank-details-overview.component.html',
  styleUrls: ['./bank-details-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankDetailsOverviewComponent implements OnInit {
  public readonly CREDIT_CARD_FORM_LINK = `${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BANK_DETAILS}/${WALLET_PATHS.CREDIT_CARD}`;
  public readonly BANK_ACCOUNT_FORM_LINK = `${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BANK_DETAILS}/${WALLET_PATHS.BANK_ACCOUNT}`;

  public bankAccount$: Observable<BankAccount>;
  public creditCard$: Observable<CreditCard>;

  constructor(
    private router: Router,
    private bankAccountService: BankAccountService,
    private paymentsCreditCardService: PaymentsCreditCardService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private errorActionService: WalletSharedErrorActionService,
    private bankAccountTrackingEventsService: BankAccountTrackingEventsService
  ) {}

  ngOnInit(): void {
    this.getBankAccountAndCreditCard();

    this.bankAccount$ = this.bankAccountService.bankAccount$.pipe(
      catchError((error: unknown) => {
        return this.handleError(error);
      })
    );
    this.creditCard$ = this.paymentsCreditCardService.creditCard$.pipe(
      catchError((error: unknown) => {
        return this.handleError(error);
      })
    );
  }

  public redirect(URL: string): void {
    this.router.navigate([URL]);
  }

  public handleBankAccountCardClick(urlRedirect: string, bankAccount: BankAccount): void {
    const isEdit = !!bankAccount;
    this.bankAccountTrackingEventsService.trackClickAddEditBankAccount(isEdit);
    this.redirect(urlRedirect);
  }

  public formattedCreditCardDate(expirationDateCard: Date): string {
    return moment(expirationDateCard).format('MM/YYYY');
  }

  public formattedBankAccountIBAN(IBANBankAccount: string): string {
    return IBANBankAccount.slice(IBANBankAccount.length - 4, IBANBankAccount.length);
  }

  public formattedBankAccountName(bankAccount: BankAccount): string {
    return `${bankAccount.first_name} ${bankAccount.last_name}`;
  }

  public openDeleteBankAccountModal(): void {
    this.generateConfirmationModalRef({
      title: BANK_DETAILS_TRANSLATIONS.POPUP_REMOVE_BANK_ACCOUNT_TITLE,
      description: BANK_DETAILS_TRANSLATIONS.POPUP_REMOVE_BANK_ACCOUNT_DESCRIPTION,
      confirmMessage: BANK_DETAILS_TRANSLATIONS.POPUP_REMOVE_BANK_ACCOUNT_CONFIRM,
      cancelMessage: BANK_DETAILS_TRANSLATIONS.POPUP_REMOVE_BANK_ACCOUNT_CANCEL,
      confirmColor: COLORS.NEGATIVE_MAIN,
    }).result.then(
      () => {
        this.deleteBankAccount();
      },
      () => {}
    );
  }

  public openDeleteCardModal(): void {
    this.generateConfirmationModalRef({
      title: BANK_DETAILS_TRANSLATIONS.POPUP_REMOVE_CREDIT_CARD_TITLE,
      description: BANK_DETAILS_TRANSLATIONS.POPUP_REMOVE_CREDIT_CARD_DESCRIPTION,
      confirmMessage: BANK_DETAILS_TRANSLATIONS.POPUP_REMOVE_CREDIT_CARD_CONFIRM,
      cancelMessage: BANK_DETAILS_TRANSLATIONS.POPUP_REMOVE_CREDIT_CARD_CANCEL,
      confirmColor: COLORS.NEGATIVE_MAIN,
    }).result.then(
      () => {
        this.deleteCard();
      },
      () => {}
    );
  }

  private getBankAccountAndCreditCard(): void {
    this.bankAccountService.get().subscribe();
    this.paymentsCreditCardService.get().subscribe();
  }

  private deleteCard(): void {
    this.paymentsCreditCardService.delete().subscribe(
      () => {
        this.showToast(BANK_DETAILS_TRANSLATIONS.DELETE_CREDIT_CARD_SUCCESS, TOAST_TYPES.SUCCESS);
      },
      () => {
        this.showToast(BANK_DETAILS_TRANSLATIONS.DELETE_CREDIT_CARD_ERROR, TOAST_TYPES.ERROR);
      }
    );
  }

  private deleteBankAccount(): void {
    this.bankAccountService.delete().subscribe(
      () => {
        this.showToast(BANK_DETAILS_TRANSLATIONS.DELETE_BANK_ACCOUNT_SUCCESS, TOAST_TYPES.SUCCESS);
      },
      () => {
        this.showToast(BANK_DETAILS_TRANSLATIONS.DELETE_BANK_ACCOUNT_ERROR, TOAST_TYPES.ERROR);
      }
    );
  }

  private showToast(text: string, type: TOAST_TYPES): void {
    this.toastService.show({
      text,
      type,
    });
  }

  private generateConfirmationModalRef(properties: ConfirmationModalProperties): NgbModalRef {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent);

    modalRef.componentInstance.properties = properties;

    return modalRef;
  }

  private handleError(error: unknown): Observable<never> {
    this.errorActionService.show(error);
    return throwError(error);
  }
}
