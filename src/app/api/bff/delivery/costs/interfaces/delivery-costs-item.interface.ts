import { Money } from '@api/core/model/money.interface';

export interface DeliveryCostsItem {
  buyerAddressCost: Money;
  carrierOfficeCost: Money;
}
