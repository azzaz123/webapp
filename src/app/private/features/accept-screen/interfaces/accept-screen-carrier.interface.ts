import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { ACCEPT_SCREEN_STEPS } from '../constants/accept-screen-steps';

export interface AcceptScreenCarrier {
  type: CARRIER_DROP_OFF_MODE;
  name: POST_OFFICE_CARRIER;
  isSelected: boolean;
  icon: string;
  title: string;
  price: string;
  information: string;
  secondaryInformation: string;
  restrictions: string;
  buttonProperties: AcceptScreenCarrierButtonProperties;
  acceptEndpoint: string;
}

export interface AcceptScreenCarrierButtonProperties {
  isShowed: boolean;
  text: string;
  redirectStep: ACCEPT_SCREEN_STEPS.MAP | ACCEPT_SCREEN_STEPS.SCHEDULE;
}
