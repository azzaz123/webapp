import { APP_LOCALE } from '@configs/subdomains.config';
import { HELP_LOCALE_BY_APP_LOCALE } from '../customer-help/constants/customer-help-locale';
import { mapDeeplinkToCustomerHelpForm } from './deeplink-to-customer-help-form.mapper';

const allLanguages: APP_LOCALE[] = ['es', 'en', 'it'];

describe.each([allLanguages])('WHEN mapping deeplink to customer help form url', (locale) => {
  it('should return the url according with the specified language', () => {
    const deeplink = 'wallapop://customerSupport/form?f=360003316777';
    const expectedCustomerHelpUrl = `https://ayuda.wallapop.com/hc/${HELP_LOCALE_BY_APP_LOCALE[locale]}/requests/new?ticket_form_id=360003316777`;

    expect(mapDeeplinkToCustomerHelpForm(locale, deeplink)).toEqual(expectedCustomerHelpUrl);
  });
});

describe('WHEN the deeplink does not have the corresponding parameter', () => {
  it('should not return any url', () => {
    const deeplink = 'wallapop://customerSupport/form';
    expect(mapDeeplinkToCustomerHelpForm(allLanguages[0], deeplink)).toBeFalsy();
  });
});

describe('WHEN the deeplink does not have the form id', () => {
  it('should not return any url', () => {
    const deeplink = 'wallapop://customerSupport/form?f=';
    expect(mapDeeplinkToCustomerHelpForm(allLanguages[0], deeplink)).toBeFalsy();
  });
});
