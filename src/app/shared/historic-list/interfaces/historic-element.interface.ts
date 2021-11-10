import { Money } from '@api/core/model/money.interface';

export interface HistoricElement<T = string> {
  id: T;
  imageUrl: string;
  iconUrl?: string;
  title: string;
  description: string;
  subDescription?: string;
  moneyAmount: Money;
}
