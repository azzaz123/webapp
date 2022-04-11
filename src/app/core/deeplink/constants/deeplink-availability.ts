import { DeeplinkType } from '../types/deeplink.type';

export const deeplinkAvailabilities: Record<DeeplinkType, boolean> = {
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
