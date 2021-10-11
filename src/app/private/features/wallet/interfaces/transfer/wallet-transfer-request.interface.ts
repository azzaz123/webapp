import { WalletTransferFunds } from '@private/features/wallet/interfaces/transfer/wallet-transfer-funds.interface';

export interface WalletTransferRequest {
  id: string;
  pay_out_id: string;
  funds: WalletTransferFunds;
}
