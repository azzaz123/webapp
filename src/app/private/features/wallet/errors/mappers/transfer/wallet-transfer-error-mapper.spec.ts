import {
  MOCK_WALLET_TRANSFER_ALREADY_STARTED_ERROR_RESPONSE,
  MOCK_WALLET_TRANSFER_EMPTY_ERROR_RESPONSE,
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
import { WalletTransferGenericError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-generic-error';
import { WalletTransferNetworkError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-network-error';

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
  describe.each(walletTransferErrorResponses)('WHEN the error is known', (errorResponse) => {
    it('should notify a generic error', () => {
      let result: WalletTransferErrorResponse;

      walletTransferErrorMapper.map(errorResponse).subscribe({
        error: (errors) => (result = errors),
      });

      expect(result instanceof WalletTransferGenericError).toBe(true);
    });
  });

  describe('AND WHEN there is no internet connection', () => {
    it('should notify a network error', () => {
      let result: WalletTransferErrorResponse;

      walletTransferErrorMapper.map(MOCK_WALLET_TRANSFER_NETWORK_ERROR_RESPONSE as WalletTransferErrorResponse).subscribe({
        error: (errors) => (result = errors),
      });

      expect(result instanceof WalletTransferNetworkError).toBe(true);
    });
  });

  describe('AND WHEN there is an unknown error', () => {
    it('should notify a generic error', () => {
      let result: WalletTransferErrorResponse;

      walletTransferErrorMapper.map(MOCK_WALLET_TRANSFER_EMPTY_ERROR_RESPONSE as WalletTransferErrorResponse).subscribe({
        error: (errors) => (result = errors),
      });

      expect(result instanceof WalletTransferGenericError).toBe(true);
    });
  });
});
