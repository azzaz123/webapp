import { Component, Input } from '@angular/core';
import { TransactionTrackingActionDeeplink } from '@api/core/model/delivery/transaction/tracking';
import { DeeplinkService } from '@api/core/utils/deeplink/deeplink.service';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';

@Component({
  selector: 'tsl-transaction-tracking-action-deeplink',
  templateUrl: './transaction-tracking-action-deeplink.component.html',
  styleUrls: ['../styles/transaction-tracking-action.scss'],
})
export class TransactionTrackingActionDeeplinkComponent {
  @Input() deeplinkAction: TransactionTrackingActionDeeplink;

  constructor(private deeplinkService: DeeplinkService, private toastService: ToastService) {}

  public navigate(): void {
    if (this.deeplinkService.isAvailable(this.deeplinkAction.linkUrl)) {
      this.deeplinkService.navigate(this.deeplinkAction.linkUrl);
    } else {
      this.toastService.show({
        title: $localize`:@@shipments_all_users_snackbar_tts_unavailable_feature_title_web_specific:Feature not available`,
        text: $localize`:@@shipments_all_users_snackbar_tts_unavailable_feature_description_web_specific:We are working on it... We appreciate your patience!`,
        type: TOAST_TYPES.ERROR,
      });
    }
  }
}
