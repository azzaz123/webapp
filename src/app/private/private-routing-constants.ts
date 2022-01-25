import { STREAMLINE_PATHS } from './features/delivery/pages/streamline/streamline.routing.constants';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';

export enum PRIVATE_PATHS {
  DELIVERY = 'delivery',
  WALLET = 'wallet',
  PROFILE = 'profile',
  CATALOG = 'catalog',
  VERIFICATION = 'verification',
  CHAT = 'chat',
  BUMPS = 'bumps',
  ACCEPT_SCREEN = 'accept',
}

export enum PRIVATE_PATH_PARAMS {
  ID = 'id',
}

export const PATH_TO_ACCEPT_SCREEN: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.SELLS}/${STREAMLINE_PATHS.ONGOING}/${PRIVATE_PATHS.ACCEPT_SCREEN}`;
