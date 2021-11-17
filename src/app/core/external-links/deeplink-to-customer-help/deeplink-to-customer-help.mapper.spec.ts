import { mapDeeplinkToCustomerHelp } from './deeplink-to-customer-help.mapper';
import { APP_LOCALE } from '@configs/subdomains.config';
import { HELP_LOCALE_BY_APP_LOCALE } from '../customer-help/constants/customer-help-locale';

const allLanguages: APP_LOCALE[] = ['es', 'en', 'it'];

describe.each([allLanguages])('WHEN mapping deeplink to customer help url', (locale) => {
  it('should return the url according with the specified language', () => {
    const deeplink = 'wallapop://customerSupport/faq/article?z=360001796618';
    const expectedCustomerHelpUrl = `https://ayuda.wallapop.com/hc/${HELP_LOCALE_BY_APP_LOCALE[locale]}/articles/360001796618`;

    expect(mapDeeplinkToCustomerHelp(locale, deeplink)).toEqual(expectedCustomerHelpUrl);
  });
});

describe('WHEN the deeplink does not have the corresponding parameter', () => {
  it('should not return any url', () => {
    const deeplink = 'wallapop://customerSupport/faq/article';
    expect(mapDeeplinkToCustomerHelp(allLanguages[0], deeplink)).toBeFalsy();
  });
});

describe('WHEN the deeplink does not have the article', () => {
  it('should not return any url', () => {
    const deeplink = 'wallapop://customerSupport/faq/article?z=';
    expect(mapDeeplinkToCustomerHelp(allLanguages[0], deeplink)).toBeFalsy();
  });
});
