import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import { ACCEPT_SCREEN_ID_STEPS } from '../constants/accept-screen-id-steps';

export interface AcceptScreenCarrier {
  type: CARRIER_DROP_OFF_MODE;
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
  redirectStep: ACCEPT_SCREEN_ID_STEPS.MAP | ACCEPT_SCREEN_ID_STEPS.SCHEDULE;
}
