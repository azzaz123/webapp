import { HttpErrorResponse } from '@angular/common/http';

import { WalletTransferDismissErrorModel } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-dismiss-error.model';
import { WalletTransferErrorMapper } from '@private/features/wallet/errors/mappers/transfer/wallet-transfer-error-mapper';
import { WalletTransferPayUserBankAccountErrorModel } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-pay-user-bank-account-error.model';

const NotFound: number = 404;

export class WalletTransferPayUserBankAccountErrorMapper extends WalletTransferErrorMapper {
  protected generateErrorByRequest(httpErrorResponse: HttpErrorResponse): Error {
    return httpErrorResponse.status === NotFound ? new WalletTransferDismissErrorModel() : new WalletTransferPayUserBankAccountErrorModel();
  }
}
