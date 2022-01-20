import { Money } from '@api/core/model/money.interface';

export interface AcceptScreenItem {
  id: string;
  imageUrl: string;
  title: string;
  price: Money;
}
