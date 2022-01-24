import { CARRIER_DROP_OFF_MODE } from '../carrier-drop-off-mode.type';
import { POST_OFFICE_CARRIER } from '../post-offices-carriers.type';
import { DELIVERY_MODE } from '../delivery-mode.type';
import { Money } from '../../money.interface';

export interface CarrierDropOffModeRequest {
  modes: DropOffModeRequest[] | [];
}

export interface DropOffModeRequest {
  type: CARRIER_DROP_OFF_MODE;
  icon: string;
  postOfficeDetails: PostOfficeDetails;
  sellerCosts: Money;
  acceptEndpoint: string;
  restrictions: string;
  schedule: TentativeSchedule;
}

export interface PostOfficeDetails {
  carrier: POST_OFFICE_CARRIER;
  lastAddressUsed: LastAddressUsed;
  selectionRequired: boolean;
}

export interface LastAddressUsed {
  buyerAddress: null;
  deliveryMode: DELIVERY_MODE;
  officeAddress: OfficeAddress;
}

export interface OfficeAddress {
  id: string;
  unit: number;
  city: string;
  postalCode: string;
  street: string;
}

export interface TentativeSchedule {
  isEditable: boolean;
  pickUpEndDate: Date;
  pickUpStartDate: Date;
}
