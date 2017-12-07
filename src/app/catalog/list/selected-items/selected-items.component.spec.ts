import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { createItemsArray, MockTrackingService } from 'shield';
import { SelectedItemsComponent } from './selected-items.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ItemService } from '../../../core/item/item.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { PRODUCT2_RESPONSE, PRODUCT_RESPONSE } from '../../../../tests/item.fixtures';
import { Order } from '../../../core/item/item-response.interface';
import { OrderEvent } from './selected-product.interface';
import { TrackingService } from "../../../core/tracking/tracking.service";

describe('SelectedItemsComponent', () => {
  let component: SelectedItemsComponent;
  let fixture: ComponentFixture<SelectedItemsComponent>;
  let itemService: ItemService;
  let trackingService: TrackingService;
  const aBumpType = 'l1kmzngg6n3p';
  const anotherBumpType = 'g24g2jhg4jh24';
  const anId = '1';
  const anotherId = '2';

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
          itemService.selectedItems = [anId, anotherId];
          fixture.detectChanges();
          itemService.selectedItems$.next({
            id: anId,
            action: 'selected'
          });
        });

        it('should set selectedItems with items', () => {
          expect(component.selectedItems).toEqual([ITEMS[0], ITEMS[1]]);
        });

        it('should call getAvailableProducts', () => {
          expect(itemService.getAvailableProducts).toHaveBeenCalledWith(anId);
        });

        it('should add product to selectedProducts', () => {
          expect(component.selectedProducts[0]).toEqual({
            itemId: anId,
            product: PRODUCT_RESPONSE
          });
        });

        it('should update total', () => {
          expect(component.total).toBe(4.79);
        });

        it('should sum all products prices', () => {
          itemService.selectedItems$.next({
            id: anotherId,
            action: 'selected'
          });

          expect(component.total).toBe(4.79 + 7.29);
        });
      });

      describe('action deselected', () => {
        beforeEach(() => {
          spyOn(itemService, 'getAvailableProducts');
          component.selectedProducts = [{
            itemId: anId,
            product: PRODUCT_RESPONSE
          }, {
            itemId: anotherId,
            product: PRODUCT2_RESPONSE
          }];
          fixture.detectChanges();
          itemService.selectedItems$.next({
            id: anId,
            action: 'deselected'
          });
        });

        it('should remove product from selectedProducts', () => {
          expect(component.selectedProducts.length).toBe(1);
          expect(component.selectedProducts[0].itemId).toBe(anotherId);
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
          id: anId,
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
        itemId: anId,
        product: PRODUCT_RESPONSE
      }, {
        itemId: anotherId,
        product: PRODUCT2_RESPONSE
      }];
      component.onAction.subscribe((order: OrderEvent) => {
        orderEvent = order;
      });

      component['calculateTotal']();
      component.featureItems();

      expect(orderEvent).toEqual({
        order: [
          {
            item_id: anId,
            product_id: aBumpType
          },
          {
            item_id: anotherId,
            product_id: anotherBumpType
          }
        ],
        total: 4.79 + 7.29
      });
    });

    it('should send event featured_checkout', () => {
      component.selectedProducts = [{
        itemId: anId,
        product: PRODUCT_RESPONSE
      }, {
        itemId: anotherId,
        product: PRODUCT2_RESPONSE
      }];
      const result = {
        selected_products:
        [
          {
            item_id: anId,
            bump_type: aBumpType,
          },
          {
            item_id: anotherId,
            bump_type: anotherBumpType,
          }
        ]
      };

      component.featureItems();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CATALOG_FEATURED_CHECKOUT, result);
    });
  });
});
