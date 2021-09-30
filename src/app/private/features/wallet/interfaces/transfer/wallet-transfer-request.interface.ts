import { WalletTransferFundsInterface } from '@private/features/wallet/interfaces/transfer/wallet-transfer-funds.interface';

export interface WalletTransferRequestInterface {
  id: string;
  pay_out_id: string;
  funds: WalletTransferFundsInterface;
}
