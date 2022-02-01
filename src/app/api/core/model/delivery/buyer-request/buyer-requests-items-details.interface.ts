import { Money } from '@api/core/model/money.interface';

export interface BuyerRequestsItemsDetails {
  categoryId: number;
  itemHash: string;
  pictureUrl: string;
  price: Money;
  sellerCountry: string;
  sellerUserHash: string;
  title: string;
}
