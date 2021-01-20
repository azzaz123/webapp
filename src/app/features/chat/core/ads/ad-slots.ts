export type AdSlotId = string;

export interface AdSlot {
  id: AdSlotId;
  name: string;
  sizes: [number, number][];
  zoneid: number;
}

export const CHAT_AD_SLOTS: AdSlot[] = [
  {
    name: '/130868815/chat_right',
    id: 'div-gpt-ad-1508490196308-0',
    sizes: [
      [240, 400],
      [120, 600],
      [160, 600],
      [300, 250],
    ],
    zoneid: 978109,
  },
];

export const AD_SLOTS = [...CHAT_AD_SLOTS] as const;
