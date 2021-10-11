import { HttpErrorResponse } from '@angular/common/http';

import { WalletTransferDismissError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-dismiss-error';
import { WalletTransferErrorMapper } from '@private/features/wallet/errors/mappers/transfer/wallet-transfer-error-mapper';
import { WalletTransferPayUserBankAccountError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-pay-user-bank-account-error';

const NotFound: number = 404;

export class WalletTransferPayUserBankAccountErrorMapper extends WalletTransferErrorMapper {
  protected generateErrorByRequest(httpErrorResponse: HttpErrorResponse): Error {
    return httpErrorResponse.status === NotFound ? new WalletTransferDismissError() : new WalletTransferPayUserBankAccountError();
  }
}
