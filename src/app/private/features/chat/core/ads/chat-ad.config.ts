import { AD_SLOT_NETWORK_ID } from '@core/ads/constants';
import { AdSlot } from '@core/ads/models';
import { DeviceType } from '@core/device/deviceType.enum';

export const CHAT_AD_SLOTS: AdSlot = {
  id: 'div-gpt-sky-1508490196308-0',
  name: '/130868815/chat_right',
  sizes: [
    [120, 600],
    [160, 600],
    [300, 250],
    [300, 600],
    [336, 280],
  ],
  networkId: AD_SLOT_NETWORK_ID,
  device: [DeviceType.TABLET, DeviceType.DESKTOP],
};
