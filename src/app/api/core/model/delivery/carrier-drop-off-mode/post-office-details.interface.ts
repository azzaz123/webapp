import { LastAddressUsed } from '../buyer/delivery-methods';
import { POST_OFFICE_CARRIER } from '../post-offices-carriers.type';

export interface PostOfficeDetails {
  carrier: POST_OFFICE_CARRIER;
  lastAddressUsed: LastAddressUsed;
  selectionRequired: boolean;
}
