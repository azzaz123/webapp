import { DeeplinkType } from '../types/deeplink.type';

export const deeplinkExternalNavigation: Record<DeeplinkType, boolean> = {
  barcodeLabel: false,
  pay: false,
  instructions: false,
  item: true,
  printableLabel: true,
  unknown: false,
  userProfile: false,
  zendeskArticle: true,
  zendeskForm: true,
};
