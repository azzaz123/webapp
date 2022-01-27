import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import { PostOfficeDetails, TentativeSchedule } from '@api/core/model/delivery/carrier-drop-off-mode';
import { Money } from '@api/core/model/money.interface';

export interface AcceptScreenCarrier {
  type: CARRIER_DROP_OFF_MODE;
  icon: string;
  isSelected: boolean;
  cost: Money;
  acceptEndpoint: string;
  restrictions: string;
}

export interface AcceptScreenDropOffPoint extends AcceptScreenCarrier {
  selectedOffice: string;
  postOfficeDetails: PostOfficeDetails;
}

export interface AcceptScreenHomePickUp extends AcceptScreenCarrier {
  schedule: TentativeSchedule;
}
