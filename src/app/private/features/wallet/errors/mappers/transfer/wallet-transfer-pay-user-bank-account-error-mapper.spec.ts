import { HttpErrorResponse } from '@angular/common/http';

import { WalletTransferDismissErrorModel } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-dismiss-error.model';
import { WalletTransferErrorResponse } from '@private/features/wallet/errors/mappers/transfer/wallet-transfer-error-mapper';
import { WalletTransferGenericErrorModel } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-generic-error.model';
import { WalletTransferPayUserBankAccountErrorMapper } from '@private/features/wallet/errors/mappers/transfer/wallet-transfer-pay-user-bank-account-error-mapper';
import { WalletTransferPayUserBankAccountErrorModel } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-pay-user-bank-account-error.model';

const walletTransferErrorMapper = new WalletTransferPayUserBankAccountErrorMapper();

describe('WHEN receiving a not found error from payment backend', () => {
  it('should dismiss the error', () => {
    let result: WalletTransferErrorResponse;
    const notFoundError = {
      status: 404,
    };

    walletTransferErrorMapper.map(notFoundError as HttpErrorResponse).subscribe({
      error: (errors) => (result = errors),
    });

    expect(result instanceof WalletTransferDismissErrorModel).toBe(true);
  });
});

describe('WHEN receiving any error different than not found error', () => {
  it('should notify a pay user bank account error', () => {
    let result: WalletTransferErrorResponse;
    const anyError = {
      status: 402,
    };

    walletTransferErrorMapper.map(anyError as WalletTransferErrorResponse).subscribe({
      error: (errors) => (result = errors),
    });

    expect(result instanceof WalletTransferPayUserBankAccountErrorModel).toBe(true);
  });
});
