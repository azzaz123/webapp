import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ConfirmationModalProperties } from '@shared/confirmation-modal/confirmation-modal.interface';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BankAccountService } from '../../../../services/bank-account/bank-account.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { DELIVERY_PATHS } from '../../../../delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { BankAccount } from '../../../../interfaces/bank-account/bank-account-api.interface';
import { I18nService } from '@core/i18n/i18n.service';
import { Observable } from 'rxjs';
import { COLORS } from '@core/colors/colors-constants';
import { Router } from '@angular/router';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';

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
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.bankAccount$ = this.bankAccountService.get();
    this.creditCard$ = this.paymentsCreditCardService.get();
  }

  public redirect(URL: string): void {
    this.router.navigate([URL]);
  }

  public openDeleteBankAccountModal(): void {
    this.generateConfirmationModalRef({
      title: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_BANK_ACCOUNT_POPUP_TITLE_DELETE),
      description: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_BANK_ACCOUNT_POPUP_DESCRIPTION_DELETE),
      confirmMessage: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_BANK_ACCOUNT_POPUP_ACCEPT_BUTTON_DELETE),
      cancelMessage: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_BANK_ACCOUNT_POPUP_CANCEL_BUTTON_DELETE),
      confirmColor: COLORS.NEGATIVE_MAIN,
    }).result.then(() => {
      this.deleteBankAccount();
    });
  }

  public openDeleteCardModal(): void {
    this.generateConfirmationModalRef({
      title: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_CREDIT_CARD_POPUP_TITLE_DELETE),
      description: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_CREDIT_CARD_POPUP_DESCRIPTION_DELETE),
      confirmMessage: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_CREDIT_CARD_POPUP_ACCEPT_BUTTON_DELETE),
      cancelMessage: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_CREDIT_CARD_POPUP_CANCEL_BUTTON_DELETE),
      confirmColor: COLORS.NEGATIVE_MAIN,
    }).result.then(() => {
      this.deleteCard();
    });
  }

  private deleteCard(): void {
    this.paymentsCreditCardService.delete().subscribe(
      () => {},
      () => {}
    );
  }

  private deleteBankAccount(): void {
    this.bankAccountService.delete().subscribe(
      () => {},
      () => {}
    );
  }

  private generateConfirmationModalRef(properties: ConfirmationModalProperties): NgbModalRef {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent);

    modalRef.componentInstance.properties = properties;

    return modalRef;
  }
}
