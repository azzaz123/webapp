import { POST_OFFICE_CARRIER } from '../post-offices-carriers.type';
import { LastAddressUsed } from './last-address-used.interface';

export interface PostOfficeDetails {
  carrier: POST_OFFICE_CARRIER;
  lastAddressUsed: LastAddressUsed;
  selectionRequired: boolean;
}
