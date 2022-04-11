import { deeplinkType } from '../types/deeplink.type';

export const deeplinkExternalNavigation: Record<deeplinkType, boolean> = {
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
