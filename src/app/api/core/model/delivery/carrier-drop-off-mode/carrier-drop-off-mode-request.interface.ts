import { CARRIER_DROP_OFF_MODE } from '../carrier-drop-off-mode.type';
import { Money } from '../../money.interface';
import { TentativeSchedule } from './tentative-schedule.interface';
import { PostOfficeDetails } from './post-office-details.interface';

export interface CarrierDropOffModeRequest {
  modes: DropOffModeRequest[] | [];
}

export interface DropOffModeRequest {
  type: CARRIER_DROP_OFF_MODE;
  icon: string;
  postOfficeDetails: PostOfficeDetails | null;
  sellerCosts: Money;
  acceptEndpoint: string;
  restrictions: string;
  schedule: TentativeSchedule | null;
}
