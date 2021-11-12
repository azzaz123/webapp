import { EN_HELP_LOCALE, ES_HELP_LOCALE, IT_HELP_LOCALE } from '@core/external-links/customer-help/constants/customer-help-locale';
import { TransactionTrackingActionDetailPayloadDeeplinkDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-action-detail-payload-dtos.interface';
import { TransactionTrackingActionDetailPayloadModel } from '@api/core/model/delivery/transaction/tracking';

describe('WHEN there is payload', () => {
  describe('WHEN the payload is of type deeplink', () => {
    let payload: TransactionTrackingActionDetailPayloadModel;

    describe.each([[EN_HELP_LOCALE], [ES_HELP_LOCALE], [IT_HELP_LOCALE]])('WHEN there is a valid deeplink', (locale) => {
      beforeEach(() => {
        const payloadDto: TransactionTrackingActionDetailPayloadDeeplinkDto = {
          link_url: 'wallapop://customerSupport/faq/article?z=360001796618',
        };
        payload = new TransactionTrackingActionDetailPayloadModel(payloadDto);
      });

      it('should return the url according with the specified language', () => {
        expect(payload.getArticleUrl(locale)).toBe(`https://ayuda.wallapop.com/hc/${locale}/articles/360001796618`);
      });
    });

    describe('WHEN the deeplink does not have the corresponding parameter', () => {
      beforeEach(() => {
        const payloadDto: TransactionTrackingActionDetailPayloadDeeplinkDto = {
          link_url: 'wallapop://customerSupport/faq/article',
        };
        payload = new TransactionTrackingActionDetailPayloadModel(payloadDto);
      });

      it('should not return any url', () => {
        expect(payload.getArticleUrl(EN_HELP_LOCALE)).toBeFalsy();
      });
    });

    describe('WHEN the deeplink does not have the article', () => {
      beforeEach(() => {
        const payloadDto: TransactionTrackingActionDetailPayloadDeeplinkDto = {
          link_url: 'wallapop://customerSupport/faq/article?z=',
        };
        payload = new TransactionTrackingActionDetailPayloadModel(payloadDto);
      });

      it('should not return any url', () => {
        expect(payload.getArticleUrl(EN_HELP_LOCALE)).toBeFalsy();
      });
    });
  });
});
