import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';

import { APP_LOCALE } from '@configs/subdomains.config';
import { DeeplinkService } from '@shared/deeplink/services/deeplink.service';
import { HELP_LOCALE_BY_APP_LOCALE } from '@core/external-links/customer-help/constants/customer-help-locale';
import { ItemDetailRoutePipe, UserProfileRoutePipe } from '@shared/pipes';
import { ItemService } from '@core/item/item.service';
import { MockToastService } from '@fixtures/toast-service.fixtures.spec';
import { SITE_URL } from '@configs/site-url.config';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { UserService } from '@core/user/user.service';

import { BehaviorSubject, of, throwError } from 'rxjs';
import { WINDOW_TOKEN } from '@core/window/window.token';
import {
  siteUrlMock,
  allLanguages,
  zendeskArticleBaseDeeplink,
  zendeskCreateDisputeFormDeeplink,
  zendeskCreateDisputeFormBaseDeeplink,
  barcodeBaseDeeplink,
  checkDeliveryInstructionBaseDeeplink,
  itemBaseDeeplink,
  printableLabelBaseDeeplink,
  userProfileBaseDeeplink,
  itemDeeplink,
  printableLabelDeeplink,
  zendeskArticleDeeplink,
  checkDeliveryInstructionDeeplink,
  packagingInstructionsDeeplink,
  userProfileDeeplink,
  fakeInstructionsType,
  fakeItem,
  fakeItemId,
  fakeItemWebSlug,
  fakePrintableUrl,
  fakeRequestId,
  fakeUser,
  fakeUserId,
  fakeUsername,
} from '@fixtures/core/deeplink/deeplink.fixtures.spec';

describe(`DeeplinkService`, () => {
  let router: Router;
  let windowRef: Window;
  let service: DeeplinkService;
  let toastService: ToastService;
  let itemService: ItemService;
  let userService: UserService;

  const MOCK_LOCALE_VALUE_SUBJECT: BehaviorSubject<APP_LOCALE> = new BehaviorSubject<APP_LOCALE>(`es`);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LOCALE_ID, useValue: MOCK_LOCALE_VALUE_SUBJECT.value },
        {
          provide: WINDOW_TOKEN,
          useValue: {
            open: () => {},
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

    router = TestBed.inject(Router);
    windowRef = TestBed.inject(WINDOW_TOKEN);
    service = TestBed.inject(DeeplinkService);
    toastService = TestBed.inject(ToastService);
    itemService = TestBed.inject(ItemService);
    userService = TestBed.inject(UserService);

    spyOn(router, 'navigate');
    spyOn(toastService, 'show');
    spyOn(windowRef, 'open');
  });

  it(`should be created`, () => {
    expect(service).toBeTruthy();
  });

  describe(`WHEN the deeplink is a customer support deeplink`, () => {
    describe.each([allLanguages])(`WHEN mapping deeplink to customer help url`, (locale) => {
      beforeEach(() => {
        MOCK_LOCALE_VALUE_SUBJECT.next(locale);
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
        MOCK_LOCALE_VALUE_SUBJECT.next(locale);
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

  describe.each([[itemDeeplink], [printableLabelDeeplink], [zendeskArticleDeeplink], [zendeskCreateDisputeFormDeeplink]])(
    `WHEN navigate to an external url`,
    (deeplink) => {
      beforeEach(() => {
        service.navigate(deeplink);
      });

      it(`should open a new tab`, fakeAsync(() => {
        service.toWebLink(deeplink).subscribe((webLink) => {
          expect(windowRef.open).toHaveBeenCalledTimes(1);
          expect(windowRef.open).toHaveBeenCalledWith(webLink);
        });

        flush();
      }));
    }
  );

  describe.each([[checkDeliveryInstructionDeeplink], [packagingInstructionsDeeplink], [userProfileDeeplink]])(
    `WHEN navigate to an internal route`,
    (deeplink) => {
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
      expect(windowRef.open).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledTimes(0);

      flush();
    }));
  });

  describe('WHEN the deeplink is an user profile', () => {
    describe(`WHEN the user service crashes`, () => {
      beforeEach(() => spyOn(userService, 'get').and.returnValue(throwError('unexpected error')));

      it(`should not return any url`, fakeAsync(() => {
        const deeplink = `${userProfileBaseDeeplink}/${fakeUserId}`;

        service.toWebLink(deeplink).subscribe((webLink: string) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });

    describe(`WHEN the user service does not return any user`, () => {
      beforeEach(() => spyOn(userService, 'get').and.returnValue(of({ webSlug: null })));

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
      beforeEach(() => spyOn(itemService, 'get').and.returnValue(throwError('unexpected error')));

      it(`should not return any url`, fakeAsync(() => {
        const deeplink = `${itemBaseDeeplink}/${fakeItemId}`;

        service.toWebLink(deeplink).subscribe((webLink: string) => {
          expect(webLink).toBeFalsy();
        });

        flush();
      }));
    });

    describe(`WHEN the item service does not return any item`, () => {
      beforeEach(() => spyOn(itemService, 'get').and.returnValue(of({ webSlug: null })));

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
