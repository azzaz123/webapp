import { APP_LOCALE } from '@configs/subdomains.config';
import { payDeeplinkPrefix } from '@shared/deeplink/constants/deeplink-prefixes';

export const fakeBarcode = 'abcZYW123908';
export const fakeInstructionsType = 'packaging';
export const fakeItemId = 'this_is_a_fake_item_id';
export const fakeItemName = 'this-is-a-fake-item';
export const fakeItemWebSlug = `${fakeItemName}-1234567890`;
export const fakeItem = {
  webSlug: fakeItemWebSlug,
};
export const fakePrintableUrl = 'http://fake.url.fake';
export const fakeRequestId = '123-456-789-000';
export const fakeUserId = 'this_is_a_fake_user_id';
export const fakeUsername = 'this_is_a_fake_username';
export const fakeWebSlug = `${fakeUsername}-1234567890`;
export const fakeUser = {
  id: fakeUserId,
  firstName: fakeUsername,
  webSlug: fakeWebSlug,
};

export const allLanguages: APP_LOCALE[] = [`es`, `en`, `it`];
export const barcodeBaseDeeplink: string = `wallapop://delivery/barcode`;
export const barcodeDeeplink: string = `${barcodeBaseDeeplink}?b=${fakeBarcode}`;
export const checkoutDeeplink: string = `${payDeeplinkPrefix}${fakeItemId}`;
export const checkDeliveryInstructionBaseDeeplink: string = `wallapop://shipping/transactiontracking/instructions`;
export const checkDeliveryInstructionDeeplink: string = `${checkDeliveryInstructionBaseDeeplink}?request_id=${fakeRequestId}&type=${fakeInstructionsType}`;
export const itemBaseDeeplink: string = `wallapop://i`;
export const itemDeeplink: string = `${itemBaseDeeplink}/$itemId`;
export const packagingInstructionsDeeplink: string = `${checkDeliveryInstructionBaseDeeplink}?request_id=${fakeRequestId}&type=${fakeInstructionsType}`;
export const printableLabelBaseDeeplink: string = `wallapop://trackinglabel`;
export const printableLabelDeeplink: string = `${printableLabelBaseDeeplink}?url=${fakePrintableUrl}`;
export const siteUrlMock: string = 'https://localhost/';
export const userProfileBaseDeeplink: string = `wallapop://p`;
export const userProfileDeeplink: string = `${userProfileBaseDeeplink}/$userId`;
export const zendeskArticleBaseDeeplink: string = `wallapop://customerSupport/faq/article`;
export const zendeskArticleDeeplink: string = `${zendeskArticleBaseDeeplink}?z=%s`;
export const zendeskCreateDisputeFormBaseDeeplink: string = `wallapop://customerSupport/form`;
export const zendeskCreateDisputeFormDeeplink: string = `${zendeskCreateDisputeFormBaseDeeplink}?f=360003316777`;
