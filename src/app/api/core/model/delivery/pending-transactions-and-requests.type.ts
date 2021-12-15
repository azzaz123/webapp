import { Request } from './request.interface';
import { PendingTransaction } from './transaction';

export type PendingTransactionsAndRequests = { requests: Request[]; transactions: PendingTransaction[] };
