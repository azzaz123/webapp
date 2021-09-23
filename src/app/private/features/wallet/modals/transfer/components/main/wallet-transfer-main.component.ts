import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Toast, TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const noComissionsMessage: Toast = {
  type: TOAST_TYPES.SUCCESS,
  text: $localize`:@@make_transfer_view_snackbar_no_commissions_description:Transfers are free, forget about fees.`,
};
@Component({
  selector: 'tsl-wallet-transfer-main',
  templateUrl: './wallet-transfer-main.component.html',
  styleUrls: ['./wallet-transfer-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletTransferMainComponent implements OnInit {
  constructor(private activeModal: NgbActiveModal, private toastService: ToastService) {}

  public ngOnInit(): void {
    this.toastService.show(noComissionsMessage);
  }

  public closeModal(): void {
    this.activeModal.close();
  }
}
