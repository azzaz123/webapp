import { LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { APP_LOCALE } from '@configs/subdomains.config';
import { DeeplinkService } from '@api/core/utils/deeplink/deeplink.service';
import { HELP_LOCALE_BY_APP_LOCALE } from '@core/external-links/customer-help/constants/customer-help-locale';
import { ItemDetailRoutePipe, UserProfileRoutePipe } from '@shared/pipes';
import { SITE_URL } from '@configs/site-url.config';

const allLanguages: APP_LOCALE[] = [`es`, `en`, `it`];
const barcodeBaseDeeplink: string = `wallapop://delivery/barcode`;
const barcodeDeeplink: string = `${barcodeBaseDeeplink}?b=\${deliveryTag.asString()}`;
const checkDeliveryInstructionBaseDeeplink: string = `wallapop://shipping/transactiontracking/instructions`;
const checkDeliveryInstructionDeeplink: string = `${checkDeliveryInstructionBaseDeeplink}?request_id=$requestId&type=\${CheckDelivery.asString()}`;
const itemBaseDeeplink: string = `wallapop://i`;
const itemDeeplink: string = `${itemBaseDeeplink}/$itemId`;
const packagingInstructionsDeeplink: string = `${checkDeliveryInstructionBaseDeeplink}?request_id=$requestId&type=\${Packaging.asString()}`;
const printableLabelBaseDeeplink: string = `wallapop://trackinglabel`;
const printableLabelDeeplink: string = `${printableLabelBaseDeeplink}?url=\${printableTagUrl.value}`;
const siteUrlMock: string = 'https://localhost/';
const userProfileBaseDeeplink: string = `wallapop://p`;
const userProfileDeeplink: string = `${userProfileBaseDeeplink}/$userId`;
const zendeskArticleBaseDeeplink: string = `wallapop://customerSupport/faq/article`;
const zendeskArticleDeeplink: string = `${zendeskArticleBaseDeeplink}?z=%s`;
const zendeskCreateDisputeFormBaseDeeplink: string = `wallapop://customerSupport/form`;
const zendeskCreateDisputeFormDeeplink: string = `${zendeskCreateDisputeFormBaseDeeplink}?f=360003316777`;

describe(`DeeplinkService`, () => {
  let router: Router;
  let service: DeeplinkService;
  let window: Window;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LOCALE_ID, useValue: `es` },
        {
          provide: Document,
          useValue: {
            defaultView: {
              open() {},
            },
          },
        },
        { provide: SITE_URL, useValue: siteUrlMock },
        DeeplinkService,
        ItemDetailRoutePipe,
        UserProfileRoutePipe,
        {
          provide: Router,
          useValue: {
            navigate() {},
          },
        },
      ],
    });
  });

  it(`should be created`, () => {
    const service = TestBed.inject(DeeplinkService);

    expect(service).toBeTruthy();
  });

  describe(`WHEN the deeplink is a customer support deeplink`, () => {
    describe.each([allLanguages])(`WHEN mapping deeplink to customer help url`, (locale) => {
      beforeEach(() => {
        TestBed.overrideProvider(LOCALE_ID, { useValue: locale });
        document = TestBed.inject(Document);
        router = TestBed.inject(Router);
        service = TestBed.inject(DeeplinkService);
        window = document.defaultView;
      });

      it(`should return the url according with the specified language`, () => {
        const deeplink = `${zendeskArticleBaseDeeplink}?z=360001796618`;
        const expected = `https://ayuda.wallapop.com/hc/${HELP_LOCALE_BY_APP_LOCALE[locale]}/articles/360001796618`;

        expect(service.toWebLink(deeplink)).toEqual(expected);
      });
    });

    describe(`WHEN the deeplink does not have the corresponding parameter`, () => {
      it(`should not return any url`, () => {
        const deeplink = zendeskArticleBaseDeeplink;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });

    describe(`WHEN the deeplink does not have the article`, () => {
      it(`should not return any url`, () => {
        const deeplink = `${zendeskArticleBaseDeeplink}?z=`;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });
  });

  describe(`WHEN the deeplink is a create dispute customer support deeplink`, () => {
    describe.each([allLanguages])(`WHEN mapping deeplink to customer form url`, (locale) => {
      beforeEach(() => {
        TestBed.overrideProvider(LOCALE_ID, { useValue: locale });
        router = TestBed.inject(Router);
        service = TestBed.inject(DeeplinkService);
      });

      it(`should return the url according with the specified language`, () => {
        const deeplink = zendeskCreateDisputeFormDeeplink;
        const expected = `https://ayuda.wallapop.com/hc/${HELP_LOCALE_BY_APP_LOCALE[locale]}/requests/new?ticket_form_id=360003316777`;

        expect(service.toWebLink(deeplink)).toEqual(expected);
      });
    });

    describe(`WHEN the deeplink does not have the corresponding parameter`, () => {
      it(`should not return any url`, () => {
        const deeplink = zendeskCreateDisputeFormBaseDeeplink;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });

    describe(`WHEN the deeplink does not have the article`, () => {
      it(`should not return any url`, () => {
        const deeplink = `${zendeskCreateDisputeFormBaseDeeplink}?f=`;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });
  });

  describe(`WHEN there is no deeplink`, () => {
    it(`should not return the url`, () => {
      const deeplink = null;
      const expected = null;

      expect(service.toWebLink(deeplink)).toEqual(expected);
    });
  });

  describe(`WHEN the deeplink is a barcode deeplink`, () => {
    it(`should return the url`, () => {
      const deeplink = `${barcodeBaseDeeplink}?b=https://my-barcode-url`;
      const expected = `https://my-barcode-url`;

      expect(service.toWebLink(deeplink)).toEqual(expected);
    });

    describe(`WHEN the deeplink does not have the corresponding parameter`, () => {
      it(`should not return any url`, () => {
        const deeplink = barcodeBaseDeeplink;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });

    describe(`WHEN the deeplink does not have the barcode`, () => {
      it(`should not return any url`, () => {
        const deeplink = `${barcodeBaseDeeplink}?b=`;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });
  });

  describe(`WHEN the deeplink is a check delivery instructions deeplink`, () => {
    it(`should return the url`, () => {
      const deeplink = `${checkDeliveryInstructionBaseDeeplink}?request_id=123&type=deeplink`;
      const expected = `delivery/tracking/123/instructions/deeplink`;

      expect(service.toWebLink(deeplink)).toEqual(expected);
    });

    describe(`WHEN the deeplink does not have the corresponding parameters`, () => {
      it(`should not return any url`, () => {
        const deeplink = checkDeliveryInstructionBaseDeeplink;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });

    describe(`WHEN the deeplink does not have the request id`, () => {
      it(`should not return any url`, () => {
        const deeplink = `${checkDeliveryInstructionBaseDeeplink}?request_id=`;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });

    describe(`WHEN the deeplink does not have the type`, () => {
      it(`should not return any url`, () => {
        const deeplink = `${checkDeliveryInstructionBaseDeeplink}?request_id=123&type=`;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });
  });

  describe(`WHEN the deeplink is a packaging instructions deeplink`, () => {
    it(`should return the url`, () => {
      const deeplink = `${checkDeliveryInstructionBaseDeeplink}?request_id=123&type=deeplink`;
      const expected = `delivery/tracking/123/instructions/deeplink`;

      expect(service.toWebLink(deeplink)).toEqual(expected);
    });

    describe(`WHEN the deeplink does not have the corresponding parameters`, () => {
      it(`should not return any url`, () => {
        const deeplink = checkDeliveryInstructionBaseDeeplink;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });

    describe(`WHEN the deeplink does not have the request id`, () => {
      it(`should not return any url`, () => {
        const deeplink = `${checkDeliveryInstructionBaseDeeplink}?request_id=`;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });

    describe(`WHEN the deeplink does not have the type`, () => {
      it(`should not return any url`, () => {
        const deeplink = `${checkDeliveryInstructionBaseDeeplink}?request_id=123&type=`;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });
  });

  describe(`WHEN the deeplink is a item deeplink`, () => {
    it(`should return the url`, () => {
      const deeplink = `${itemBaseDeeplink}/my-item-id`;
      const expected = `${siteUrlMock}item/my-item-id`;

      expect(service.toWebLink(deeplink)).toEqual(expected);
    });

    describe(`WHEN the deeplink does not have the corresponding parameter`, () => {
      it(`should not return any url`, () => {
        const deeplink = itemBaseDeeplink;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });

    describe(`WHEN the deeplink does not have the item id`, () => {
      it(`should not return any url`, () => {
        const deeplink = `${itemBaseDeeplink}/`;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });
  });

  describe(`WHEN the deeplink is a printable label deeplink`, () => {
    it(`should return the url`, () => {
      const deeplink = `${printableLabelBaseDeeplink}?url=my-printable-url`;
      const expected = `my-printable-url`;

      expect(service.toWebLink(deeplink)).toEqual(expected);
    });

    describe(`WHEN the deeplink does not have the corresponding parameter`, () => {
      it(`should not return any url`, () => {
        const deeplink = printableLabelBaseDeeplink;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });

    describe(`WHEN the deeplink does not have the item id`, () => {
      it(`should not return any url`, () => {
        const deeplink = `${printableLabelBaseDeeplink}?url=`;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });
  });

  describe(`WHEN the deeplink is a user profile deeplink`, () => {
    it(`should return the url`, () => {
      const deeplink = `${userProfileBaseDeeplink}/user-id`;

      expect(service.toWebLink(deeplink)).toBeFalsy();
    });

    describe(`WHEN the deeplink does not have the corresponding parameter`, () => {
      it(`should not return any url`, () => {
        const deeplink = userProfileBaseDeeplink;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });

    describe(`WHEN the deeplink does not have the user id`, () => {
      it(`should not return any url`, () => {
        const deeplink = `${userProfileBaseDeeplink}/`;

        expect(service.toWebLink(deeplink)).toBeFalsy();
      });
    });
  });

  describe(`WHEN asking whether the deeplink is a barcode deeplink`, () => {
    describe.each([
      [`${barcodeBaseDeeplink}?b=url`, true],
      [`wallapop://no-delivery/barcode?b=url`, false],
    ])(`WHEN`, (deeplink, expected) => {
      it(`should correctly check the deeplink `, () => {
        expect(service.isBarcodeLabelDeeplink(deeplink)).toBe(expected);
      });
    });
  });

  describe(`WHEN asking whether the deeplink is a check delivery instructions deeplink`, () => {
    describe.each([
      [checkDeliveryInstructionDeeplink, true],
      [`wallapop://no-shipping/transactiontracking/instructions?request_id=$requestId&type=\${CheckDelivery.asString()}`, false],
    ])(`WHEN`, (deeplink, expected) => {
      it(`should correctly check the deeplink `, () => {
        expect(service.isInstructionsDeeplink(deeplink)).toBe(expected);
      });
    });
  });

  describe(`WHEN asking whether the deeplink is an item deeplink`, () => {
    describe.each([
      [itemDeeplink, true],
      [`wallapop://no-i/$itemId`, false],
    ])(`WHEN`, (deeplink, expected) => {
      it(`should correctly check the deeplink `, () => {
        expect(service.isItemDeeplink(deeplink)).toBe(expected);
      });
    });
  });

  describe(`WHEN asking whether the deeplink is a packaging instructions deeplink`, () => {
    describe.each([
      [packagingInstructionsDeeplink, true],
      [`wallapop://no-shipping/transactiontracking/instructions?request_id=$requestId&type=\${Packaging.asString()}`, false],
    ])(`WHEN`, (deeplink, expected) => {
      it(`should correctly check the deeplink `, () => {
        expect(service.isInstructionsDeeplink(deeplink)).toBe(expected);
      });
    });
  });

  describe(`WHEN asking whether the deeplink is a printable label deeplink`, () => {
    describe.each([
      [printableLabelDeeplink, true],
      [`wallapop://no-trackinglabel?url=\${printableTagUrl.value}`, false],
    ])(`WHEN`, (deeplink, expected) => {
      it(`should correctly check the deeplink `, () => {
        expect(service.isPrintableLabelDeeplink(deeplink)).toBe(expected);
      });
    });
  });

  describe(`WHEN asking whether the deeplink is an user profile deeplink`, () => {
    describe.each([
      [userProfileDeeplink, true],
      [`wallapop://no-p/$userId`, false],
    ])(`WHEN`, (deeplink, expected) => {
      it(`should correctly check the deeplink `, () => {
        expect(service.isUserProfileDeeplink(deeplink)).toBe(expected);
      });
    });
  });

  describe(`WHEN asking whether the deeplink is a Zendesk article deeplink`, () => {
    describe.each([
      [zendeskArticleDeeplink, true],
      [`wallapop://no-customerSupport/faq/article?z=%s`, false],
    ])(`WHEN`, (deeplink, expected) => {
      it(`should correctly check the deeplink `, () => {
        expect(service.isZendeskArticleDeeplink(deeplink)).toBe(expected);
      });
    });
  });

  describe(`WHEN asking whether the deeplink is a Zendesk create dispute form deeplink`, () => {
    describe.each([
      [zendeskCreateDisputeFormDeeplink, true],
      [`wallapop://no-customerSupport/form?f=360003316777`, false],
    ])(`WHEN`, (deeplink, expected) => {
      it(`should correctly check the deeplink `, () => {
        expect(service.isZendeskCreateDisputeFormDeeplink(deeplink)).toBe(expected);
      });
    });
  });

  describe(`WHEN asking about the availability`, () => {
    describe.each([
      [barcodeDeeplink, false],
      [checkDeliveryInstructionDeeplink, true],
      [packagingInstructionsDeeplink, true],
      [itemDeeplink, true],
      [printableLabelDeeplink, true],
      [userProfileDeeplink, false],
      [zendeskArticleDeeplink, true],
      [zendeskCreateDisputeFormDeeplink, true],
    ])(`WHEN asking whether a deeplink is available for navigation`, (deeplink, expected) => {
      it(`should correctly check the availability`, () => {
        expect(service.isAvailable(deeplink)).toBe(expected);
      });
    });

    describe(`AND WHEN there is an incorrect deeplink`, () => {
      it(`should indicate the deeplink is not available`, () => {
        expect(service.isAvailable(`fake-deeplink`)).toBeFalsy();
      });
    });
  });

  describe.each([[itemDeeplink], [printableLabelDeeplink], [zendeskArticleDeeplink], [zendeskCreateDisputeFormDeeplink]])(
    `WHEN navigate to an external url`,
    (deeplink) => {
      beforeEach(() => {
        spyOn(window, `open`);
      });

      it(`should open a new tab`, () => {
        service.navigate(deeplink);

        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(service.toWebLink(deeplink), `_blank`);
      });
    }
  );

  describe.each([[checkDeliveryInstructionDeeplink], [packagingInstructionsDeeplink]])(`WHEN navigate to an internal route`, (deeplink) => {
    beforeEach(() => {
      spyOn(router, `navigate`);
    });

    it(`should navigate to an angular route`, () => {
      service.navigate(deeplink);

      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith([service.toWebLink(deeplink)]);
    });
  });

  describe.each([[barcodeDeeplink], ['some-unknown-url'], [userProfileDeeplink]])(
    `WHEN navigate to an unavailable deeplink`,
    (deeplink) => {
      beforeEach(() => {
        spyOn(window, `open`);
        spyOn(router, 'navigate');
      });

      it(`should not navigate`, () => {
        service.navigate(deeplink);

        expect(window.open).toHaveBeenCalledTimes(0);
        expect(router.navigate).toHaveBeenCalledTimes(0);
      });
    }
  );
});
