import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { Toast, TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { translations } from '@core/i18n/translations/constants/translations';
import { WalletTransferApiService } from '@private/features/wallet/services/api/transfer-api/wallet-transfer-api.service';
import { WalletTransferError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-error';
import { WalletTransferMapperService } from '@private/features/wallet/services/transfer/mapper/wallet-transfer-mapper.service';
import { WalletTransferMoneyInterface } from '@private/features/wallet/modals/transfer/interfaces/wallet-transfer-money.interface';
import { WalletTransferService } from '@private/features/wallet/services/transfer/wallet-transfer.service';
import { WalletTransferTrackingEventService } from '@private/features/wallet/modals/transfer/services/wallet-transfer-tracking-event.service';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const transferSentMessage: Toast = {
  type: TOAST_TYPES.SUCCESS,
  text: $localize`:@@make_transfer_view_snackbar_money_sent_description:Money sent! Will be reflected in your account within the indicated period.`,
};

@Component({
  selector: 'tsl-wallet-transfer-confirm',
  templateUrl: './wallet-transfer-confirm.component.html',
  styleUrls: ['./wallet-transfer-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [WalletTransferApiService, WalletTransferMapperService, WalletTransferService],
})
export class WalletTransferConfirmComponent {
  @Input()
  public transferAmount: WalletTransferMoneyInterface;

  @Output()
  public canceled: EventEmitter<never> = new EventEmitter<never>();
  @Output()
  public transferError: EventEmitter<WalletTransferMoneyInterface> = new EventEmitter<WalletTransferMoneyInterface>();

  public isTransferInProgress: boolean;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private ngbActiveModal: NgbActiveModal,
    private toastService: ToastService,
    private transferService: WalletTransferService,
    private transferTrackingEventService: WalletTransferTrackingEventService
  ) {}

  public get amountAsText(): string {
    return this.transferAmount?.toString();
  }

  public cancelTransfer(): void {
    this.canceled.emit();
  }

  public confirmTransfer(): void {
    if (this.isTransferInProgress) {
      return;
    }
    this.isTransferInProgress = true;
    this.changeDetectorRef.detectChanges();

    this.transferTrackingEventService.trackConfirmTransferBankAccount(
      this.transferAmount.balance.amount.total,
      this.transferAmount.amount.total
    );

    this.transferService.transfer(this.transferAmount).subscribe(
      () => {
        this.toastService.show(transferSentMessage);
        this.ngbActiveModal.close();
      },
      (error: WalletTransferError) => {
        this.toastService.show({
          text: error.message,
          title: translations[TRANSLATION_KEY.TOAST_ERROR_TITLE],
          type: TOAST_TYPES.ERROR,
        });
        this.setTransferError();
      }
    );
  }

  private setTransferError(): void {
    this.transferError.emit(this.transferAmount);
  }
}
