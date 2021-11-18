import { TransactionTrackingActionDetailPayloadDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import { TransactionTrackingActionDetailPayloadModel } from '@api/core/model/delivery/transaction/tracking';
import { HELP_LOCALE } from '@core/external-links/customer-help/types/help-locale';

describe('WHEN they get the article url', () => {
  describe('AND WHEN the source match the expected template', () => {
    let target: TransactionTrackingActionDetailPayloadModel;
    beforeEach(() => {
      const payloadDto: TransactionTrackingActionDetailPayloadDto = {
        link_url: 'wallapop://customerSupport/faq/article?z=360019810637',
      };
      target = new TransactionTrackingActionDetailPayloadModel(payloadDto);
    });
    describe.each([['es-ES'], ['en-US'], ['it']])('WHEN they use different languages', (language) => {
      it('should receive the corresponding article url', () => {
        const articleUrl = target.getHelpArticleUrl(language as HELP_LOCALE);

        expect(articleUrl).toBe(`https://ayuda.wallapop.com/hc/${language}/articles/360019810637`);
      });
    });
  });
  describe('AND WHEN the source does not match the expected template', () => {
    let target: TransactionTrackingActionDetailPayloadModel;
    beforeEach(() => {
      const payloadDto: TransactionTrackingActionDetailPayloadDto = {
        link_url: 'wallapop://customerSupport/faq/article/360019810637',
      };
      target = new TransactionTrackingActionDetailPayloadModel(payloadDto);
    });
    describe.each([['es-ES'], ['en-US'], ['it']])('WHEN they use different languages', (language) => {
      it('should not receive any article url', () => {
        const articleUrl = target.getHelpArticleUrl(language as HELP_LOCALE);

        expect(articleUrl).toBeFalsy();
      });
    });
  });
});
