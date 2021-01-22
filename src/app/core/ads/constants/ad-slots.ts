import { AdSlot } from '../models/ad-slot.interface';

export const AD_SLOT_NETWORK_ID = 6866;

export const CHAT_AD_SLOTS: AdSlot[] = [
  {
    id: 'div-gpt-ad-1508490196308-0',
    name: '/130868815/chat_right',
    sizes: [
      [120, 600],
      [160, 600],
      [300, 250],
      [300, 600],
      [336, 280],
    ],
    networkId: AD_SLOT_NETWORK_ID,
  },
];

export const AD_SLOTS = [...CHAT_AD_SLOTS];
