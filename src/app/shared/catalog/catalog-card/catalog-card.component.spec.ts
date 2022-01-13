import { DecimalPipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ItemChangeEvent } from '@private/features/catalog/core/item-change.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { getMockItemWithPurchases, ITEM_ID, MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { ErrorsService } from '../../../core/errors/errors.service';
import { EventService } from '../../../core/event/event.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { Item } from '../../../core/item/item';
import { ItemService } from '../../../core/item/item.service';
import { CustomCurrencyPipe } from '../../pipes';
import { CatalogCardComponent } from './catalog-card.component';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { ItemRouteDirectiveMock } from '@fixtures/item-route.fixtures.spec';

describe('CatalogCardComponent', () => {
  let component: CatalogCardComponent;
  let fixture: ComponentFixture<CatalogCardComponent>;
  let itemService: ItemService;
  let modalService: NgbModal;
  let errorsService: ErrorsService;
  let i18nService: I18nService;
  let eventService: EventService;
  const modal: any = { modal: true };
  const componentInstance = {
    price: null,
    item: null,
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CatalogCardComponent, CustomCurrencyPipe, ItemRouteDirectiveMock],
        providers: [
          DecimalPipe,
          I18nService,
          {
            provide: ItemService,
            useValue: {
              selectedItems: [],
              selectItem() {},
              deselectItem() {},
              reserveItem() {
                return of({});
              },
              setSold() {
                return of({});
              },
              cancelAutorenew() {
                return of({});
              },
            },
          },
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  result: Promise.resolve(),
                  componentInstance: componentInstance,
                };
              },
            },
          },
          {
            provide: ErrorsService,
            useValue: {
              i18nError() {},
            },
          },
          {
            provide: SITE_URL,
            useValue: MOCK_SITE_URL,
          },
          EventService,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogCardComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM;
    fixture.detectChanges();
    itemService = TestBed.inject(ItemService);
    modalService = TestBed.inject(NgbModal);
    errorsService = TestBed.inject(ErrorsService);
    i18nService = TestBed.inject(I18nService);
    eventService = TestBed.inject(EventService);
  });

  describe('select', () => {
    it('should set selected true and call selectItem', () => {
      const item: Item = MOCK_ITEM;
      item.selected = false;
      spyOn(itemService, 'selectItem');

      component.select(item);

      expect(item.selected).toBe(true);
      expect(itemService.selectItem).toHaveBeenCalledWith(ITEM_ID);
    });

    it('should set selected false and call deselectItem', () => {
      const item: Item = MOCK_ITEM;
      item.selected = true;
      spyOn(itemService, 'deselectItem');

      component.select(item);

      expect(item.selected).toBe(false);
      expect(itemService.deselectItem).toHaveBeenCalledWith(ITEM_ID);
    });
  });

  describe('setSold', () => {
    let item: Item;
    let event: ItemChangeEvent;

    describe('can mark as sold', () => {
      beforeEach(fakeAsync(() => {
        item = MOCK_ITEM;
        spyOn(eventService, 'emit');
        spyOn(window as any, 'fbq');
        component.itemChange.subscribe(($event: ItemChangeEvent) => {
          event = $event;
        });

        component.setSold(item);
      }));

      afterEach(() => {
        event = undefined;
      });

      it('should emit the updated item', () => {
        expect(event.item).toEqual(item);
        expect(event.action).toBe('sold');
      });

      it('should emit ITEM_SOLD event', () => {
        expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_SOLD, item);
      });

      it('should send facebook CompleteRegistrations tracking', () => {
        expect(window['fbq']).toHaveBeenCalledWith('track', 'CompleteRegistration', { value: item.salePrice, currency: item.currencyCode });
      });
    });
  });

  describe('reserve', () => {
    let item: Item;

    describe('not reserved', () => {
      beforeEach(fakeAsync(() => {
        spyOn(itemService, 'reserveItem').and.callThrough();
        spyOn(eventService, 'emit');
        item = MOCK_ITEM;
        item.reserved = false;

        component.reserve(item);
      }));

      it('should call reserve with false', () => {
        expect(itemService.reserveItem).toHaveBeenCalledWith(ITEM_ID, true);
        expect(item.reserved).toBe(true);
      });

      it('should emit ITEM_RESERVED event', () => {
        expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_RESERVED, item);
      });
    });

    describe('already reserved', () => {
      beforeEach(() => {
        spyOn(itemService, 'reserveItem').and.callThrough();
        spyOn(eventService, 'emit');
        item = MOCK_ITEM;
        item.reserved = true;
        component.reserve(item);
      });

      it('should call reserve with false', () => {
        expect(itemService.reserveItem).toHaveBeenCalledWith(ITEM_ID, false);
        expect(item.reserved).toBe(false);
      });

      it('should emit ITEM_RESERVED event', () => {
        expect(eventService.emit).toHaveBeenCalledWith(EventService.ITEM_RESERVED, item);
      });
    });
  });

  describe('cancel Autorenew', () => {
    beforeEach(fakeAsync(() => {
      spyOn(itemService, 'cancelAutorenew').and.returnValue(of({ status: 200 }));
      spyOn(modalService, 'open').and.callThrough();
      component.cancelAutorenew(MOCK_ITEM, modal);
      tick();
    }));

    it('should set selected true and call selectItem', () => {
      expect(modalService.open).toHaveBeenCalledWith(modal);
      expect(itemService.cancelAutorenew).toHaveBeenCalledWith(MOCK_ITEM.id);
    });
  });

  describe('ngOnInit', () => {
    it('should set the bump name', () => {
      spyOn(i18nService, 'translate').and.callThrough();
      component.item = getMockItemWithPurchases();

      component.ngOnInit();

      expect(i18nService.translate).toHaveBeenCalledWith(component.item.purchases.bump_type);
      expect(component.bumpName).toBe('City Bump');
    });
  });
});
