import { HttpErrorResponse } from '@angular/common/http';

import { WalletTransferDismissError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-dismiss-error';
import { WalletTransferErrorResponse } from '@private/features/wallet/errors/mappers/transfer/wallet-transfer-error-mapper';
import { WalletTransferPayUserBankAccountErrorMapper } from '@private/features/wallet/errors/mappers/transfer/wallet-transfer-pay-user-bank-account-error-mapper';
import { WalletTransferPayUserBankAccountError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-pay-user-bank-account-error';

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

    expect(result instanceof WalletTransferDismissError).toBe(true);
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

    expect(result instanceof WalletTransferPayUserBankAccountError).toBe(true);
  });
});
