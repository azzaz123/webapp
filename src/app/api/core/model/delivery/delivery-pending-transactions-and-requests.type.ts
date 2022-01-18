import { Request } from './request.interface';
import { DeliveryPendingTransaction } from './transaction/delivery-pending-transaction.interface';

export type DeliveryPendingTransactionsAndRequests = { requests: Request[]; transactions: DeliveryPendingTransaction[] };
