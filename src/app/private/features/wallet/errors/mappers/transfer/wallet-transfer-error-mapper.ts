import { ErrorMapper } from '@api/core/utils/classes/';
import { HttpErrorResponse } from '@angular/common/http';

import { WalletErrorResponseApi } from '@private/features/wallet/errors/classes/wallet-error-response-api';
import { WalletTransferErrorEnum } from '@private/features/wallet/errors/mappers/transfer/wallet-transfer-error.enum';
import { WalletTransferError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-error';
import { WalletTransferGenericError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-generic-error';
import { WalletTransferNetworkError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-network-error';

export type WalletTransferErrorResponse = WalletErrorResponseApi<WalletTransferErrorEnum>;

export class WalletTransferErrorMapper extends ErrorMapper<WalletTransferErrorResponse> {
  protected generateErrorByRequest(response: HttpErrorResponse): Error {
    return response.error instanceof Array ? this.getApiFirstError(response) : this.getNetworkErrors();
  }

  protected getError(error_code?: WalletTransferErrorEnum): WalletTransferError {
    if (error_code === WalletTransferErrorEnum.Network) {
      return new WalletTransferNetworkError();
    }
    return new WalletTransferGenericError();
  }

  private getApiFirstError(response: HttpErrorResponse): Error {
    const mappedErrors: Error[] = [];
    const { error: backendWalletTransferErrors } = response;

    backendWalletTransferErrors.forEach((error) => {
      mappedErrors.push(this.getError(error.error_code));
    });

    return mappedErrors[0] ?? this.getError();
  }

  private getNetworkErrors(): Error {
    return this.getError(WalletTransferErrorEnum.Network);
  }
}
