import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ConfirmationModalProperties } from '@shared/confirmation-modal/confirmation-modal.interface';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BankAccountService } from '@private/features/delivery/services/bank-account/bank-account.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { BankAccount } from '@private/features/delivery/interfaces/bank-account/bank-account-api.interface';
import { I18nService } from '@core/i18n/i18n.service';
import { Observable } from 'rxjs';
import { COLORS } from '@core/colors/colors-constants';
import { Router } from '@angular/router';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import * as moment from 'moment';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';

@Component({
  selector: 'tsl-bank-details-overview',
  templateUrl: './bank-details-overview.component.html',
  styleUrls: ['./bank-details-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankDetailsOverviewComponent implements OnInit {
  public bankAccount$: Observable<BankAccount>;
  public creditCard$: Observable<CreditCard>;

  public CREDIT_CARD_FORM_LINK = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.BANK_DETAILS}/${DELIVERY_PATHS.CREDIT_CARD}`;
  public BANK_ACCOUNT_FORM_LINK = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.BANK_DETAILS}/${DELIVERY_PATHS.BANK_ACCOUNT}`;

  constructor(
    private router: Router,
    private bankAccountService: BankAccountService,
    private paymentsCreditCardService: PaymentsCreditCardService,
    private i18nService: I18nService,
    private modalService: NgbModal,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getBankAccountAndCreditCard();

    this.bankAccount$ = this.bankAccountService.bankAccount$;
    this.creditCard$ = this.paymentsCreditCardService.creditCard$;
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
    this.bankAccountService.get().subscribe();
    this.paymentsCreditCardService.get().subscribe();
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
}
