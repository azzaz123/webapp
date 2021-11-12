import { Transaction } from '.';

export interface HistoricTransaction extends Transaction {
  creationDate: Date;
}
