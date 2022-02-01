import { DeliveryAddress } from '../address/delivery-address.interface';
import { DELIVERY_MODE } from '../delivery-mode.type';
import { OfficeAddress } from './office-address.interface';

export interface LastAddressUsed {
  buyerAddress: DeliveryAddress;
  deliveryMode: DELIVERY_MODE;
  officeAddress: OfficeAddress;
}
