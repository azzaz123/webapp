import {
  MOCK_WALLET_TRANSFER_ALREADY_STARTED_ERROR_RESPONSE,
  MOCK_WALLET_TRANSFER_INSUFFICIENT_FUNDS_ERROR_RESPONSE,
  MOCK_WALLET_TRANSFER_LESS_THAN_MINIMUM_ERROR_RESPONSE,
  MOCK_WALLET_TRANSFER_NETWORK_ERROR_RESPONSE,
  MOCK_WALLET_TRANSFER_UNKNOWN_ERROR_RESPONSE,
  MOCK_WALLET_TRANSFER_USER_NOT_FOUND_ERROR_RESPONSE,
  MOCK_WALLET_TRANSFER_WALLET_BLOCKED_ERROR_RESPONSE,
} from '@fixtures/private/wallet/errors/wallet-transfer-errors.fixtures.spec';
import {
  WalletTransferErrorMapper,
  WalletTransferErrorResponse,
} from '@private/features/wallet/errors/mappers/transfer/wallet-transfer-error-mapper';
import { WalletTransferGenericErrorModel } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-generic-error.model';
import { WalletTransferNetworkErrorModel } from '../../classes/transfer/wallet-transfer-network-error.model';

const walletTransferErrorMapper = new WalletTransferErrorMapper();
const walletTransferErrorResponses = [
  [MOCK_WALLET_TRANSFER_ALREADY_STARTED_ERROR_RESPONSE],
  [MOCK_WALLET_TRANSFER_INSUFFICIENT_FUNDS_ERROR_RESPONSE],
  [MOCK_WALLET_TRANSFER_LESS_THAN_MINIMUM_ERROR_RESPONSE],
  [MOCK_WALLET_TRANSFER_WALLET_BLOCKED_ERROR_RESPONSE],
  [MOCK_WALLET_TRANSFER_USER_NOT_FOUND_ERROR_RESPONSE],
  [MOCK_WALLET_TRANSFER_UNKNOWN_ERROR_RESPONSE],
];

describe('WHEN receiving an error from payment backend', () => {
  describe.each(walletTransferErrorResponses)('AND WHEN server notifies an already started error', (errorResponse) => {
    it('should notify a generic error', () => {
      let results: WalletTransferErrorResponse[];

      walletTransferErrorMapper.map(errorResponse).subscribe({
        error: (errors) => (results = errors),
      });

      expect(results[0] instanceof WalletTransferGenericErrorModel).toBe(true);
    });
  });

  describe('AND WHEN server notifies an already started error', () => {
    it('should notify a netword error', () => {
      let results: WalletTransferErrorResponse[];

      walletTransferErrorMapper.map(MOCK_WALLET_TRANSFER_NETWORK_ERROR_RESPONSE).subscribe({
        error: (errors) => (results = errors),
      });

      expect(results[0] instanceof WalletTransferNetworkErrorModel).toBe(true);
    });
  });
});
