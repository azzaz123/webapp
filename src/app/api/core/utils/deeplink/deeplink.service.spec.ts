import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';

import { APP_LOCALE } from '@configs/subdomains.config';
import { DeeplinkService } from '@api/core/utils/deeplink/deeplink.service';
import { HELP_LOCALE_BY_APP_LOCALE } from '@core/external-links/customer-help/constants/customer-help-locale';
import { ItemDetailRoutePipe, UserProfileRoutePipe } from '@shared/pipes';
import { ItemService } from '@core/item/item.service';
import { MockToastService } from '@fixtures/toast-service.fixtures.spec';
import { SITE_URL } from '@configs/site-url.config';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { UserService } from '@core/user/user.service';

import { of, throwError } from 'rxjs';

const fakeBarcode = 'abcZYW123908';
const fakeInstructionsType = 'packaging';
const fakeItemId = 'this_is_a_fake_item_id';
const fakeItemName = 'this-is-a-fake-item';
const fakeItemWebSlug = `${fakeItemName}-1234567890`;
const fakeItem = {
  webSlug: fakeItemWebSlug,
};
const fakePrintableUrl = 'http://fake.url.fake';
const fakeRequestId = '123-456-789-000';
const fakeUserId = 'this_is_a_fake_user_id';
const fakeUsername = 'this_is_a_fake_username';
const fakeWebSlug = `${fakeUsername}-1234567890`;
const fakeUser = {
  id: fakeUserId,
  firstName: fakeUsername,
  webSlug: fakeWebSlug,
};

const allLanguages: APP_LOCALE[] = [`es`, `en`, `it`];
const barcodeBaseDeeplink: string = `wallapop://delivery/barcode`;
const barcodeDeeplink: string = `${barcodeBaseDeeplink}?b=${fakeBarcode}`;
const checkDeliveryInstructionBaseDeeplink: string = `wallapop://shipping/transactiontracking/instructions`;
const checkDeliveryInstructionDeeplink: string = `${checkDeliveryInstructionBaseDeeplink}?request_id=${fakeRequestId}&type=${fakeInstructionsType}`;
const itemBaseDeeplink: string = `wallapop://i`;
const itemDeeplink: string = `${itemBaseDeeplink}/$itemId`;
const packagingInstructionsDeeplink: string = `${checkDeliveryInstructionBaseDeeplink}?request_id=${fakeRequestId}&type=${fakeInstructionsType}`;
const printableLabelBaseDeeplink: string = `wallapop://trackinglabel`;
const printableLabelDeeplink: string = `${printableLabelBaseDeeplink}?url=${fakePrintableUrl}`;
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
  let toastService: ToastService;
  let itemService: ItemService;
  let userService: UserService;

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
        {
          provide: ItemService,
          useValue: {
            get: () => {
              return of(fakeItem);
            },
          },
        },
        ItemDetailRoutePipe,
        UserProfileRoutePipe,
        {
          provide: Router,
          useValue: {
            navigate() {},
          },
        },
        {
          provide: UserService,
          useValue: {
            get: () => {
              return of(fakeUser);
            },
          },
        },
        {
          provide: ToastService,
          useClass: MockToastService,
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

      it(`should return the url according with the specified language`, fakeAsync(() => {
        const deeplink = `${zendeskArticleBaseDeeplink}?z=360001796618`;
        const expected = `https://ayuda.wallapop.com/hc/${HELP_LOCALE_BY_APP_LOCALE[locale]}/articles/360001796618`;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toEqual(expected);
        });

        flush();
      }));
    });

    describe(`WHEN the deeplink does not have the corresponding parameter`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = zendeskArticleBaseDeeplink;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });

    describe(`WHEN the deeplink does not have the article`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = `${zendeskArticleBaseDeeplink}?z=`;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });
  });

  describe(`WHEN the deeplink is a create dispute customer support deeplink`, () => {
    describe.each([allLanguages])(`WHEN mapping deeplink to customer form url`, (locale) => {
      beforeEach(() => {
        TestBed.overrideProvider(LOCALE_ID, { useValue: locale });
        router = TestBed.inject(Router);
        service = TestBed.inject(DeeplinkService);
        toastService = TestBed.inject(ToastService);
      });

      it(`should return the url according with the specified language`, fakeAsync(() => {
        const deeplink = zendeskCreateDisputeFormDeeplink;
        const expected = `https://ayuda.wallapop.com/hc/${HELP_LOCALE_BY_APP_LOCALE[locale]}/requests/new?ticket_form_id=360003316777`;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toEqual(expected);
        });

        flush();
      }));
    });

    describe(`WHEN the deeplink does not have the corresponding parameter`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = zendeskCreateDisputeFormBaseDeeplink;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });

    describe(`WHEN the deeplink does not have the article`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = `${zendeskCreateDisputeFormBaseDeeplink}?f=`;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });
  });

  describe(`WHEN there is no deeplink`, () => {
    it(`should not return the url`, fakeAsync(() => {
      const deeplink = null;
      const expected = null;

      service.toWebLink(deeplink).subscribe((webLink) => {
        expect(webLink).toEqual(expected);
      });

      flush();
    }));
  });

  describe(`WHEN the deeplink is a barcode deeplink`, () => {
    it(`should return the route`, fakeAsync(() => {
      const deeplink = `${barcodeBaseDeeplink}?b=AB123BA`;
      const expected = `delivery/tracking/barcode/AB123BA`;

      service.toWebLink(deeplink).subscribe((webLink) => {
        expect(webLink).toEqual(expected);
      });

      flush();
    }));

    describe(`WHEN the deeplink does not have the corresponding parameter`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = barcodeBaseDeeplink;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });

    describe(`WHEN the deeplink does not have the barcode`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = `${barcodeBaseDeeplink}?b=`;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });
  });

  describe(`WHEN the deeplink is a check delivery instructions deeplink`, () => {
    it(`should return the url`, fakeAsync(() => {
      const deeplink = `${checkDeliveryInstructionBaseDeeplink}?request_id=${fakeRequestId}&type=${fakeInstructionsType}`;
      const expected = `delivery/tracking/${fakeRequestId}/instructions/${fakeInstructionsType}`;

      service.toWebLink(deeplink).subscribe((webLink) => {
        expect(webLink).toEqual(expected);
      });

      flush();
    }));

    describe(`WHEN the deeplink does not have the corresponding parameters`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = checkDeliveryInstructionBaseDeeplink;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });

    describe(`WHEN the deeplink does not have the request id`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = `${checkDeliveryInstructionBaseDeeplink}?request_id=`;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });

    describe(`WHEN the deeplink does not have the type`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = `${checkDeliveryInstructionBaseDeeplink}?request_id=${fakeRequestId}&type=`;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });
  });

  describe(`WHEN the deeplink is a packaging instructions deeplink`, () => {
    it(`should return the url`, fakeAsync(() => {
      const deeplink = `${checkDeliveryInstructionBaseDeeplink}?request_id=${fakeRequestId}&type=${fakeInstructionsType}`;
      const expected = `delivery/tracking/${fakeRequestId}/instructions/${fakeInstructionsType}`;

      service.toWebLink(deeplink).subscribe((webLink) => {
        expect(webLink).toEqual(expected);
      });

      flush();
    }));

    describe(`WHEN the deeplink does not have the corresponding parameters`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = checkDeliveryInstructionBaseDeeplink;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });

    describe(`WHEN the deeplink does not have the request id`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = `${checkDeliveryInstructionBaseDeeplink}?request_id=`;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });

    describe(`WHEN the deeplink does not have the type`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = `${checkDeliveryInstructionBaseDeeplink}?request_id=${fakeRequestId}&type=`;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });
  });

  describe(`WHEN the deeplink is a item deeplink`, () => {
    beforeEach(() => {
      router = TestBed.inject(Router);
      service = TestBed.inject(DeeplinkService);
      itemService = TestBed.inject(ItemService);
      toastService = TestBed.inject(ToastService);

      spyOn(itemService, 'get').and.callThrough();
    });

    it(`should return the url`, fakeAsync(() => {
      const deeplink = `${itemBaseDeeplink}/${fakeItemId}`;
      const expected = `${siteUrlMock}item/${fakeItemWebSlug}`;

      service.toWebLink(deeplink).subscribe((webLink) => {
        expect(webLink).toEqual(expected);
      });

      flush();
    }));

    it('should call to the item service', fakeAsync(() => {
      const deeplink = `${itemBaseDeeplink}/${fakeItemId}`;

      service.toWebLink(deeplink).subscribe((webLink) => {
        expect(itemService.get).toHaveBeenCalledTimes(1);
      });

      flush();
    }));

    describe(`WHEN the deeplink does not have the corresponding parameter`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = itemBaseDeeplink;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });

    describe(`WHEN the deeplink does not have the item id`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = `${itemBaseDeeplink}/`;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });
  });

  describe(`WHEN the deeplink is a printable label deeplink`, () => {
    it(`should return the url`, fakeAsync(() => {
      const deeplink = `${printableLabelBaseDeeplink}?url=${fakePrintableUrl}`;
      const expected = fakePrintableUrl;

      service.toWebLink(deeplink).subscribe((webLink) => {
        expect(webLink).toEqual(expected);
      });

      flush();
    }));

    describe(`WHEN the deeplink does not have the corresponding parameter`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = printableLabelBaseDeeplink;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });

    describe(`WHEN the deeplink does not have the item id`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = `${printableLabelBaseDeeplink}?url=`;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });
  });

  describe(`WHEN the deeplink is a user profile deeplink`, () => {
    beforeEach(() => {
      router = TestBed.inject(Router);
      service = TestBed.inject(DeeplinkService);
      userService = TestBed.inject(UserService);
      toastService = TestBed.inject(ToastService);

      spyOn(userService, 'get').and.callThrough();
    });

    it(`should return the url`, fakeAsync(() => {
      const deeplink = `${userProfileBaseDeeplink}/${fakeUserId}`;
      const expected = `/user/${fakeUsername}-${fakeUserId}`;

      service.toWebLink(deeplink).subscribe((webLink) => {
        expect(webLink).toBeTruthy();
        expect(webLink).toBe(expected);
      });

      flush();
    }));

    it('should call to the user service', fakeAsync(() => {
      const deeplink = `${userProfileBaseDeeplink}/${fakeUserId}`;

      service.toWebLink(deeplink).subscribe((webLink) => {
        expect(userService.get).toHaveBeenCalledTimes(1);
      });

      flush();
    }));

    describe(`WHEN the deeplink does not have the corresponding parameter`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = userProfileBaseDeeplink;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });

    describe(`WHEN the deeplink does not have the user id`, () => {
      it(`should not return any url`, fakeAsync(() => {
        const deeplink = `${userProfileBaseDeeplink}/`;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
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
      [`wallapop://no-shipping/transactiontracking/instructions?request_id=${fakeRequestId}&type=${fakeInstructionsType}`, false],
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
      [`wallapop://no-shipping/transactiontracking/instructions?request_id=${fakeRequestId}&type=${fakeInstructionsType}`, false],
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
      [barcodeDeeplink, true],
      [checkDeliveryInstructionDeeplink, true],
      [packagingInstructionsDeeplink, true],
      [itemDeeplink, true],
      [printableLabelDeeplink, true],
      [userProfileDeeplink, true],
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

      it(`should open a new tab`, fakeAsync(() => {
        service.navigate(deeplink);

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(window.open).toHaveBeenCalledTimes(1);
          expect(window.open).toHaveBeenCalledWith(webLink, `_blank`);
        });

        flush();
      }));
    }
  );

  describe.each([[checkDeliveryInstructionDeeplink], [packagingInstructionsDeeplink], [userProfileDeeplink]])(
    `WHEN navigate to an internal route`,
    (deeplink) => {
      beforeEach(() => {
        spyOn(router, `navigate`);
      });

      it(`should navigate to an angular route`, fakeAsync(() => {
        service.navigate(deeplink);

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(router.navigate).toHaveBeenCalledTimes(1);
          expect(router.navigate).toHaveBeenCalledWith([webLink]);
        });

        flush();
      }));
    }
  );

  describe.each([['some_kind_of_strange_deeplink'], ['some-unknown-url']])(`WHEN navigate to an unavailable deeplink`, (deeplink) => {
    beforeEach(() => {
      spyOn(window, `open`);
      spyOn(router, 'navigate');
      spyOn(toastService, 'show');

      service.navigate(deeplink);
    });

    it('should show an error toast', fakeAsync(() => {
      expect(toastService.show).toHaveBeenCalledTimes(1);
      expect(toastService.show).toHaveBeenCalledWith({
        title: $localize`:@@shipments_all_users_snackbar_tts_unavailable_feature_title_web_specific:Feature not available`,
        text: $localize`:@@shipments_all_users_snackbar_tts_unavailable_feature_description_web_specific:We are working on it... We appreciate your patience!`,
        type: TOAST_TYPES.ERROR,
      });

      flush();
    }));

    it(`should not navigate`, fakeAsync(() => {
      expect(window.open).toHaveBeenCalledTimes(0);
      expect(router.navigate).toHaveBeenCalledTimes(0);

      flush();
    }));
  });

  describe('WHEN the deeplink is an user profile', () => {
    describe(`WHEN the user service crashes`, () => {
      beforeEach(() => {
        TestBed.overrideProvider(UserService, {
          useValue: {
            get: () => {
              return throwError('unexpected error');
            },
          },
        });
        service = TestBed.inject(DeeplinkService);
      });

      it(`should not return any url`, fakeAsync(() => {
        const deeplink = `${userProfileBaseDeeplink}/${fakeUserId}`;

        service.toWebLink(deeplink).subscribe((webLink: string) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });

    describe(`WHEN the user service does not return any user`, () => {
      beforeEach(() => {
        TestBed.overrideProvider(UserService, {
          useValue: {
            get: () => {
              return of({ webSlug: null });
            },
          },
        });
        service = TestBed.inject(DeeplinkService);
      });

      it(`should not return any url`, fakeAsync(() => {
        const deeplink = `${userProfileBaseDeeplink}/${fakeUserId}`;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });
  });

  describe('WHEN the deeplink is an item', () => {
    describe(`WHEN the item service crashes`, () => {
      beforeEach(() => {
        TestBed.overrideProvider(ItemService, {
          useValue: {
            get: () => {
              return throwError('unexpected error');
            },
          },
        });
        service = TestBed.inject(DeeplinkService);
      });

      it(`should not return any url`, fakeAsync(() => {
        const deeplink = `${itemBaseDeeplink}/${fakeItemId}`;

        service.toWebLink(deeplink).subscribe((webLink: string) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });

    describe(`WHEN the item service does not return any item`, () => {
      beforeEach(() => {
        TestBed.overrideProvider(ItemService, {
          useValue: {
            get: () => {
              return of({ webSlug: null });
            },
          },
        });
        service = TestBed.inject(DeeplinkService);
      });

      it(`should not return any url`, fakeAsync(() => {
        const deeplink = `${itemBaseDeeplink}/${fakeItemId}`;

        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });
  });
});
