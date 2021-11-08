import { Transaction } from '.';

export interface TransactionWithCreationDate extends Transaction {
  creationDate: Date;
}
