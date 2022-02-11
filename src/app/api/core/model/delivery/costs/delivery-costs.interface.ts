import { Money } from '@api/core/model/money.interface';

export interface DeliveryCosts {
  buyerAddressCost: Money;
  carrierOfficeCost: Money;
}
