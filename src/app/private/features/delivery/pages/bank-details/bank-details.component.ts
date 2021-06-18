import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ConfirmationModalProperties } from '@shared/confirmation-modal/confirmation-modal.interface';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BankAccountService } from '../../services/bank-account/bank-account.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { DELIVERY_PATHS } from '../../delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { BankAccount } from '../../interfaces/bank-account/bank-account-api.interface';
import { I18nService } from '@core/i18n/i18n.service';
import { Observable } from 'rxjs';
import { COLORS } from '@core/colors/colors-constants';
import { Router } from '@angular/router';

@Component({
  selector: 'tsl-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankDetailsComponent implements OnInit {
  public bankAccount$: Observable<BankAccount>;
  public CREDIT_CARD_FORM_LINK = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.CREDIT_CARD}`;
  public BANK_ACCOUNT_FORM_LINK = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.BANK_ACCOUNT}`;

  constructor(
    private router: Router,
    private bankAccountService: BankAccountService,
    private i18nService: I18nService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.bankAccount$ = this.bankAccountService.get();
  }

  public redirect(URL: string): void {
    this.router.navigate([URL]);
  }

  public openDeleteBankAccountModal(): void {
    this.generateConfirmationModalRef({
      description: this.i18nService.translate(TRANSLATION_KEY.ACTIVE),
      confirmMessage: this.i18nService.translate(TRANSLATION_KEY.ACTIVE),
      cancelMessage: this.i18nService.translate(TRANSLATION_KEY.ACTIVE),
      confirmColor: COLORS.NEGATIVE_MAIN,
    }).result.then(() => {
      this.deleteBankAccount();
    });
  }

  public openDeleteCardModal(): void {
    this.generateConfirmationModalRef({
      description: this.i18nService.translate(TRANSLATION_KEY.ACTIVE),
      confirmMessage: this.i18nService.translate(TRANSLATION_KEY.ACTIVE),
      cancelMessage: this.i18nService.translate(TRANSLATION_KEY.ACTIVE),
      confirmColor: COLORS.NEGATIVE_MAIN,
    }).result.then(() => {
      this.deleteCard();
    });
  }

  private deleteCard(): void {}

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
