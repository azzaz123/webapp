import { Money } from '@api/core/model/money.interface';

export interface HistoricElement {
  imageUrl: string;
  iconUrl?: string;
  title: string;
  description: string;
  subDescription?: string;
  date: Date;
  moneyAmmount: Money;
}
