import { WindowMessage } from './window-message.interface';

export interface WindowMessageWrapper {
  payload: WindowMessage;
  fromWallapop: true;
}
