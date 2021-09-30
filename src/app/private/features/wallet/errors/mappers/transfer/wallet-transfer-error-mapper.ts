import { ErrorMapper } from '@api/core/utils/classes/';
import { WalletErrorResponseApi } from '@private/features/wallet/errors/classes/wallet-error-response-api';
import { WalletTransferErrorEnum } from '@private/features/wallet/errors/mappers/transfer/wallet-transfer-error.enum';
import { WalletTransferErrorModel } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-error.model';
import { WalletTransferGenericErrorModel } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-generic-error.model';
import { WalletTransferNetworkErrorModel } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-network-error.model';

export type WalletTransferErrorResponse = WalletErrorResponseApi<WalletTransferErrorEnum>;

export class WalletTransferErrorMapper extends ErrorMapper<WalletTransferErrorResponse> {
  protected generateErrorByRequest(response: WalletTransferErrorResponse): Error[] {
    const mappedErrors: Error[] = [];
    const { error: backendWalletTransferErrors } = response;

    backendWalletTransferErrors.forEach((error) => {
      mappedErrors.push(this.getError(error.error_code));
    });

    return mappedErrors;
  }

  private getError(error_code: WalletTransferErrorEnum): WalletTransferErrorModel {
    if (error_code === WalletTransferErrorEnum.Network) {
      return new WalletTransferNetworkErrorModel();
    }
    return new WalletTransferGenericErrorModel();
  }
}
