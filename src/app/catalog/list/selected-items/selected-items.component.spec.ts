import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { createItemsArray, TrackingService, MockTrackingService } from 'shield';
import { SelectedItemsComponent } from './selected-items.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ItemService } from '../../../core/item/item.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { PRODUCT2_RESPONSE, PRODUCT_RESPONSE } from '../../../../tests/item.fixtures';
import { Order } from '../../../core/item/item-response.interface';
import { OrderEvent } from './selected-product.interface';

describe('SelectedItemsComponent', () => {
  let component: SelectedItemsComponent;
  let fixture: ComponentFixture<SelectedItemsComponent>;
  let itemService: ItemService;
  let trackingService: TrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedItemsComponent],
      imports: [NoopAnimationsModule],
      providers: [
        {
          provide: ItemService, useValue: {
          selectedItems$: new ReplaySubject(1),
          selectedItems: [],
          selectedAction: null,
          getAvailableProducts() {
          }
        }
        },
        {provide: TrackingService, useClass: MockTrackingService},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedItemsComponent);
    component = fixture.componentInstance;
    itemService = TestBed.get(ItemService);
    trackingService = TestBed.get(TrackingService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    describe('featured selectedAction', () => {

      beforeEach(() => {
        itemService.selectedAction = 'feature';
      });

      describe('action selected', () => {
        let ITEMS;
        beforeEach(() => {
          spyOn(itemService, 'getAvailableProducts').and.returnValues(Observable.of(PRODUCT_RESPONSE), Observable.of(PRODUCT2_RESPONSE));
          ITEMS = createItemsArray(5);
          component.items = ITEMS;
          itemService.selectedItems = ['1', '2'];
          fixture.detectChanges();
          itemService.selectedItems$.next({
            id: '1',
            action: 'selected'
          });
        });
        it('should set selectedItems with items', () => {
          expect(component.selectedItems).toEqual([ITEMS[0], ITEMS[1]]);
        });
        it('should call getAvailableProducts', () => {
          expect(itemService.getAvailableProducts).toHaveBeenCalledWith('1');
        });
        it('should add product to selectedProducts', () => {
          expect(component.selectedProducts[0]).toEqual({
            itemId: '1',
            product: PRODUCT_RESPONSE
          });
        });
        it('should update total', () => {
          expect(component.total).toBe(4.79);
        });
        it('should sum all products prices', () => {
          itemService.selectedItems$.next({
            id: '2',
            action: 'selected'
          });
          expect(component.total).toBe(12.08);
        });
      });

      describe('action deselected', () => {
        beforeEach(() => {
          spyOn(itemService, 'getAvailableProducts');
          component.selectedProducts = [{
            itemId: '1',
            product: PRODUCT_RESPONSE
          }, {
            itemId: '2',
            product: PRODUCT2_RESPONSE
          }];
          fixture.detectChanges();
          itemService.selectedItems$.next({
            id: '1',
            action: 'deselected'
          });
        });
        it('should remove product from selectedProducts', () => {
          expect(component.selectedProducts.length).toBe(1);
          expect(component.selectedProducts[0].itemId).toBe('2');
        });
        it('should update total', () => {
          expect(component.total).toBe(7.29);
        });
      });

    });

    describe('other selectedAction', () => {
      it('should not update total', () => {
        itemService.selectedAction = 'reserve';
        fixture.detectChanges();
        itemService.selectedItems$.next({
          id: '1',
          action: 'selected'
        });
        expect(component.total).toBe(0);
      });
    });
  });

  describe('featureItems', () => {
    beforeEach(() => {
      spyOn(trackingService, 'track');
    });
    it('should emit order', () => {
      let orderEvent: OrderEvent;
      component.selectedProducts = [{
        itemId: '1',
        product: PRODUCT_RESPONSE
      }, {
        itemId: '2',
        product: PRODUCT2_RESPONSE
      }];
      component.onAction.subscribe((order: OrderEvent) => {
        orderEvent = order;
      });
      component['calculateTotal']();
      component.featureItems();
      expect(orderEvent).toEqual({
        order: [{
          item_id: '1',
          product_id: 'l1kmzngg6n3p'
        }
          , {
            item_id: '2',
            product_id: 'g24g2jhg4jh24'
          }
        ],
        total: 4.79 + 7.29
      });
    });
    it('should send event featured_checkout', () => {
      let order: Array<Order>;
      component.selectedProducts = [{
        itemId: '1',
        product: PRODUCT_RESPONSE
      }, {
        itemId: '2',
        product: PRODUCT2_RESPONSE
      }];
      order = [
        {
          item_id: '1',
          product_id: 'l1kmzngg6n3p'
        },
        {
          item_id: '2',
          product_id: 'g24g2jhg4jh24'
        }
      ];
      component.featureItems();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CATALOG_FEATURED_CHECKOUT,
        { item_id: order[0].item_id, bump_type: order[0].product_id });
    });
  });
});
