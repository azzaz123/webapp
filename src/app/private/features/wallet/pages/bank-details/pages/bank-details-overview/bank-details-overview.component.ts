import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ConfirmationModalProperties } from '@shared/confirmation-modal/confirmation-modal.interface';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BankAccountService } from '@private/features/wallet/services/bank-account/bank-account.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { BankAccount } from '@private/features/wallet/interfaces/bank-account/bank-account-api.interface';
import { I18nService } from '@core/i18n/i18n.service';
import { forkJoin, Observable, throwError } from 'rxjs';
import { COLORS } from '@core/colors/colors-constants';
import { Router } from '@angular/router';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import * as moment from 'moment';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { WALLET_PATHS } from '@private/features/wallet/wallet.routing.constants';
import { catchError } from 'rxjs/operators';
import { WalletSharedErrorActionService } from '@private/features/wallet/shared/error-action';

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
    private i18nService: I18nService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private errorActionService: WalletSharedErrorActionService
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
      title: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_BANK_ACCOUNT_POPUP_TITLE_DELETE),
      description: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_BANK_ACCOUNT_POPUP_DESCRIPTION_DELETE),
      confirmMessage: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_BANK_ACCOUNT_POPUP_ACCEPT_BUTTON_DELETE),
      cancelMessage: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_BANK_ACCOUNT_POPUP_CANCEL_BUTTON_DELETE),
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
      title: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_CREDIT_CARD_POPUP_TITLE_DELETE),
      description: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_CREDIT_CARD_POPUP_DESCRIPTION_DELETE),
      confirmMessage: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_CREDIT_CARD_POPUP_ACCEPT_BUTTON_DELETE),
      cancelMessage: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_CREDIT_CARD_POPUP_CANCEL_BUTTON_DELETE),
      confirmColor: COLORS.NEGATIVE_MAIN,
    }).result.then(
      () => {
        this.deleteCard();
      },
      () => {}
    );
  }

  private getBankAccountAndCreditCard(): void {
    forkJoin({
      bankAccount: this.bankAccountService.get(),
      creditCard: this.paymentsCreditCardService.get(),
    })
      .pipe(
        catchError((error: unknown) => {
          return this.handleError(error);
        })
      )
      .subscribe();
  }

  private deleteCard(): void {
    this.paymentsCreditCardService.delete().subscribe(
      () => {
        this.showToast(TRANSLATION_KEY.DELIVERY_CREDIT_CARD_DELETE_SUCCESS, TOAST_TYPES.SUCCESS);
      },
      () => {
        this.showToast(TRANSLATION_KEY.DELIVERY_CREDIT_CARD_DELETE_ERROR, TOAST_TYPES.ERROR);
      }
    );
  }

  private deleteBankAccount(): void {
    this.bankAccountService.delete().subscribe(
      () => {
        this.showToast(TRANSLATION_KEY.DELIVERY_BANK_ACCOUNT_DELETE_SUCCESS, TOAST_TYPES.SUCCESS);
      },
      () => {
        this.showToast(TRANSLATION_KEY.DELIVERY_BANK_ACCOUNT_DELETE_ERROR, TOAST_TYPES.ERROR);
      }
    );
  }

  private showToast(key: TRANSLATION_KEY, type: TOAST_TYPES): void {
    this.toastService.show({
      text: `${this.i18nService.translate(key)}`,
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
