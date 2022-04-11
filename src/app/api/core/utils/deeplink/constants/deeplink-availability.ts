import { deeplinkType } from '../types/deeplink.type';

export const deeplinkAvailabilities: Record<deeplinkType, boolean> = {
  barcodeLabel: true,
  pay: true,
  instructions: true,
  item: true,
  printableLabel: true,
  unknown: false,
  userProfile: true,
  zendeskArticle: true,
  zendeskForm: true,
};
