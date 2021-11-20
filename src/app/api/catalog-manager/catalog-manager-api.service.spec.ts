import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CatalogManagerHttpService } from './http/catalog-manager-http.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { CatalogManagerApiService, PAGE_SIZE } from './catalog-manager-api.service';
import { MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED, MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED } from '@fixtures/subscriptions.fixtures.spec';
import { MOCK_SUBSCRIPTION_SLOTS_GENERAL_RESPONSE, MOCK_SUBSCRIPTION_SLOTS } from '@fixtures/subscription-slots.fixtures.spec';
import { SubscriptionSlot } from '@api/core/model/subscriptions/slots/subscription-slot.interface';
import { SUBSCRIPTION_CATEGORY_TYPES } from '@core/subscriptions/subscriptions.interface';
import { STATUS } from '@private/features/catalog/components/selected-items/selected-product.interface';
import {
  MOCK_ITEM_BY_SUBSCRIPTION_TYPE_2_MAPPED,
  MOCK_ITEM_BY_SUBSCRIPTION_TYPE_MAPPED,
  MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE,
  MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE_2,
} from '@fixtures/items-subscription-type.fixtures.spec';
import { Item } from '@core/item/item';

describe('CatalogManagerApiService', () => {
  let service: CatalogManagerApiService;
  let subscriptionsService: SubscriptionsService;
  let httpService: CatalogManagerHttpService;
  let catalogManagerService: CatalogManagerHttpService;
  let itemsBySubscriptionTypeSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CatalogManagerApiService,
        CatalogManagerHttpService,
        {
          provide: SubscriptionsService,
          useValue: {
            getSubscriptions() {},
          },
        },
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CatalogManagerApiService);
    httpService = TestBed.inject(CatalogManagerHttpService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    catalogManagerService = TestBed.inject(CatalogManagerHttpService);
    itemsBySubscriptionTypeSpy = spyOn(catalogManagerService, 'getItemsBySubscriptionType');
  });

  describe('when asked to retrieve subscription slots', () => {
    it('should return domain subscriptions slots formatted', () => {
      spyOn(httpService, 'getSlots').and.returnValue(of(MOCK_SUBSCRIPTION_SLOTS_GENERAL_RESPONSE));
      spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(
        of([MOCK_SUBSCRIPTION_CARS_SUBSCRIBED_MAPPED, MOCK_SUBSCRIPTION_RE_SUBSCRIBED_MAPPED])
      );
      let response: SubscriptionSlot[];

      service.getSlots().subscribe((data: SubscriptionSlot[]) => {
        response = data;
      });

      expect(httpService.getSlots).toHaveBeenCalledTimes(1);
      expect(httpService.getSlots).toHaveBeenCalledWith();
      expect(subscriptionsService.getSubscriptions).toHaveBeenCalledTimes(1);
      expect(subscriptionsService.getSubscriptions).toHaveBeenCalledWith(false);
      expect(response).toEqual(MOCK_SUBSCRIPTION_SLOTS);
    });
  });

  describe('when asked to retrieve items by subscription type', () => {
    describe('and has cache active', () => {
      describe('and has items cached', () => {
        beforeEach(() => {
          itemsBySubscriptionTypeSpy.and.returnValue(
            of([MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE, MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE_2])
          );
        });
        it('should return data', () => {
          let response: Item[] = [];
          service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, true).subscribe((resp) => {
            response = resp;
          });
          service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, true).subscribe();

          expect(response).toEqual([MOCK_ITEM_BY_SUBSCRIPTION_TYPE_MAPPED, MOCK_ITEM_BY_SUBSCRIPTION_TYPE_2_MAPPED]);
        });
        it('should not make request twice', () => {
          service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, true).subscribe(() => {});
          service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, true).subscribe(() => {});

          expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledTimes(1);
          expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledWith(
            0,
            PAGE_SIZE,
            SUBSCRIPTION_CATEGORY_TYPES.CARS,
            STATUS.ACTIVE
          );
        });
      });
      describe('and has no items cached', () => {
        beforeEach(() => {
          itemsBySubscriptionTypeSpy.and.returnValue(
            of([MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE, MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE_2])
          );
        });
        it('should return data', () => {
          let response: Item[] = [];
          service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, true).subscribe((resp) => {
            response = resp;
          });

          expect(response).toEqual([MOCK_ITEM_BY_SUBSCRIPTION_TYPE_MAPPED, MOCK_ITEM_BY_SUBSCRIPTION_TYPE_2_MAPPED]);
        });
        it('should not make twice', () => {
          service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, true).subscribe(() => {});

          expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledTimes(1);
          expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledWith(
            0,
            PAGE_SIZE,
            SUBSCRIPTION_CATEGORY_TYPES.CARS,
            STATUS.ACTIVE
          );
        });
      });
    });
    describe('and has not cache active', () => {
      describe('and has items cached', () => {
        describe('and has not filters or order enabled', () => {
          beforeEach(() => {
            itemsBySubscriptionTypeSpy.and.returnValue(of([MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE]));
          });
          it('should return data', () => {
            let response: Item[] = [];
            service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, true).subscribe((resp) => {
              response = resp;
            });

            expect(response).toEqual([MOCK_ITEM_BY_SUBSCRIPTION_TYPE_MAPPED]);
          });
          it('should make request always', () => {
            service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, true).subscribe(() => {});
            service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, false).subscribe(() => {});

            expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledTimes(2);
            expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledWith(
              0,
              PAGE_SIZE,
              SUBSCRIPTION_CATEGORY_TYPES.CARS,
              STATUS.ACTIVE
            );
          });
        });
      });
      describe('and has not items cached', () => {
        beforeEach(() => {
          itemsBySubscriptionTypeSpy.and.returnValue(of([MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE]));
        });
        it('should return data', () => {
          let response: Item[] = [];
          service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, true).subscribe((resp) => {
            response = resp;
          });

          expect(response).toEqual([MOCK_ITEM_BY_SUBSCRIPTION_TYPE_MAPPED]);
        });
        it('should make request always', () => {
          service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, false).subscribe(() => {});
          service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, false).subscribe(() => {});

          expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledTimes(2);
          expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledWith(
            0,
            PAGE_SIZE,
            SUBSCRIPTION_CATEGORY_TYPES.CARS,
            STATUS.ACTIVE
          );
        });
        describe('and return more than the page size', () => {
          beforeEach(() => {
            const page1 = new Array(PAGE_SIZE).fill(MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE);
            const page2 = new Array(PAGE_SIZE).fill(MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE);
            const page3 = new Array(PAGE_SIZE - 1).fill(MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE);
            itemsBySubscriptionTypeSpy.and.returnValues(of(page1), of(page2), of(page3));
          });
          it('should make all request request', () => {
            service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, false).subscribe(() => {});

            expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledTimes(3);
            expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledWith(
              0,
              PAGE_SIZE,
              SUBSCRIPTION_CATEGORY_TYPES.CARS,
              STATUS.ACTIVE
            );
            expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledWith(
              PAGE_SIZE,
              PAGE_SIZE,
              SUBSCRIPTION_CATEGORY_TYPES.CARS,
              STATUS.ACTIVE
            );
            expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledWith(
              PAGE_SIZE + PAGE_SIZE,
              PAGE_SIZE,
              SUBSCRIPTION_CATEGORY_TYPES.CARS,
              STATUS.ACTIVE
            );
          });
          it('should concat result', () => {
            let result: Item[] = [];
            const expectedResult = new Array(PAGE_SIZE + PAGE_SIZE + PAGE_SIZE - 1).fill(MOCK_ITEM_BY_SUBSCRIPTION_TYPE_MAPPED);

            service
              .itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, false)
              .subscribe((res) => (result = res));
            expect(result).toEqual(expectedResult);
          });
        });
        describe('and return the page size', () => {
          beforeEach(() => {
            const page1 = new Array(PAGE_SIZE).fill(MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE);
            const page2 = [];
            itemsBySubscriptionTypeSpy.and.returnValues(of(page1), of(page2));
          });
          it('should make all request request', () => {
            service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, false).subscribe(() => {});

            expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledTimes(2);
            expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledWith(
              0,
              PAGE_SIZE,
              SUBSCRIPTION_CATEGORY_TYPES.CARS,
              STATUS.ACTIVE
            );
            expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledWith(
              PAGE_SIZE,
              PAGE_SIZE,
              SUBSCRIPTION_CATEGORY_TYPES.CARS,
              STATUS.ACTIVE
            );
          });
          it('should concat result', () => {
            let result: Item[] = [];
            const expectedResult = new Array(PAGE_SIZE).fill(MOCK_ITEM_BY_SUBSCRIPTION_TYPE_MAPPED);

            service
              .itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, false)
              .subscribe((res) => (result = res));
            expect(result).toEqual(expectedResult);
          });
        });
        describe('and return less than page size', () => {
          beforeEach(() => {
            const page1 = new Array(PAGE_SIZE - 1).fill(MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE);
            itemsBySubscriptionTypeSpy.and.returnValues(of(page1));
          });
          it('should make one request', () => {
            service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, false).subscribe(() => {});

            expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledTimes(1);
            expect(catalogManagerService.getItemsBySubscriptionType).toBeCalledWith(
              0,
              PAGE_SIZE,
              SUBSCRIPTION_CATEGORY_TYPES.CARS,
              STATUS.ACTIVE
            );
          });
          it('should return result', () => {
            let result: Item[] = [];
            const expectedResult = new Array(PAGE_SIZE - 1).fill(MOCK_ITEM_BY_SUBSCRIPTION_TYPE_MAPPED);

            service
              .itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, null, false)
              .subscribe((res) => (result = res));
            expect(result).toEqual(expectedResult);
          });
        });
      });
    });
    describe('and has filter enabled', () => {
      beforeEach(() => {
        itemsBySubscriptionTypeSpy.and.returnValue(
          of([MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE, MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE_2])
        );
      });
      it('should return filtered data with the equal word', () => {
        let response: Item[] = [];
        service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, 'agua', true).subscribe((resp) => {
          response = resp;
        });

        expect(response).toEqual([MOCK_ITEM_BY_SUBSCRIPTION_TYPE_MAPPED]);
      });
      it('should return filtered data without case sensitive ', () => {
        let response: Item[] = [];
        service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, 'aGua', true).subscribe((resp) => {
          response = resp;
        });

        expect(response).toEqual([MOCK_ITEM_BY_SUBSCRIPTION_TYPE_MAPPED]);
      });
      it('should return filtered data with spaces', () => {
        let response: Item[] = [];
        service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, '', STATUS.ACTIVE, '   agua   ', true).subscribe((resp) => {
          response = resp;
        });

        expect(response).toEqual([MOCK_ITEM_BY_SUBSCRIPTION_TYPE_MAPPED]);
      });
    });
    describe('and has sorted data', () => {
      beforeEach(() => {
        itemsBySubscriptionTypeSpy.and.returnValue(
          of([MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE, MOCK_ITEM_BY_SUBSCRIPTION_TYPE_RESPONSE_2])
        );
      });
      it('should return desc sorted data', () => {
        let response: Item[] = [];
        service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, 'price_desc', STATUS.ACTIVE, null, true).subscribe((resp) => {
          response = resp;
        });

        expect(response).toEqual([MOCK_ITEM_BY_SUBSCRIPTION_TYPE_2_MAPPED, MOCK_ITEM_BY_SUBSCRIPTION_TYPE_MAPPED]);
      });
      it('should return asc sorted data', () => {
        let response: Item[] = [];
        service.itemsBySubscriptionType(SUBSCRIPTION_CATEGORY_TYPES.CARS, 'price_asc', STATUS.ACTIVE, null, true).subscribe((resp) => {
          response = resp;
        });

        expect(response).toEqual([MOCK_ITEM_BY_SUBSCRIPTION_TYPE_MAPPED, MOCK_ITEM_BY_SUBSCRIPTION_TYPE_2_MAPPED]);
      });
    });
  });
});
