import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { Observable } from 'rxjs/Observable';
import { ITEM_ID, ITEMS_WITH_PRODUCTS, ITEMS_WITH_PRODUCTS_PROVINCE } from '../../../tests/item.fixtures.spec';
import { ActivatedRoute, Router } from '@angular/router';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let itemService: ItemService;
  let router: Router;
  let spyCall;
  let route: ActivatedRoute;

  const SELECTED_ITEMS = ['1', '2', '3'];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutComponent],
      providers: [
        {
          provide: ItemService, useValue: {
          selectedItems: SELECTED_ITEMS,
          getItemsWithAvailableProducts() {
            return Observable.of(ITEMS_WITH_PRODUCTS);
          }
        }
        },
        {
          provide: Router, useValue: {
          navigate() {
          }
        }
        },
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({})
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    itemService = TestBed.get(ItemService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    spyCall = spyOn(itemService, 'getItemsWithAvailableProducts').and.callThrough();
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {

    describe('no params', () => {
      it('should call getItemsWithAvailableProducts and set it', () => {
        expect(itemService.getItemsWithAvailableProducts).toHaveBeenCalledWith(SELECTED_ITEMS);
        expect(component.itemsWithProducts).toEqual(ITEMS_WITH_PRODUCTS);
      });

      it('should redirect to catalog if no item selected', () => {
        spyOn(router, 'navigate');
        itemService.selectedItems = [];

        component.ngOnInit();

        expect(router.navigate).toHaveBeenCalledWith(['catalog/list']);
      });

      it('should set provincialBump to true if no citybump', () => {
        spyCall.and.returnValue(Observable.of(ITEMS_WITH_PRODUCTS_PROVINCE));

        component.ngOnInit();

        expect(component.provincialBump).toBeTruthy();
      });
    });

    describe('with params', () => {

      beforeEach(() => {
        route.params = Observable.of({
          itemId: ITEM_ID
        });
      });

      it('should call getItemsWithAvailableProducts and set it', () => {
        component.ngOnInit();

        expect(itemService.getItemsWithAvailableProducts).toHaveBeenCalledWith([ITEM_ID]);
        expect(component.itemsWithProducts).toEqual(ITEMS_WITH_PRODUCTS);
      });

      it('should set provincialBump to true if no citybump', () => {
        spyCall.and.returnValue(Observable.of(ITEMS_WITH_PRODUCTS_PROVINCE));

        component.ngOnInit();

        expect(component.provincialBump).toBeTruthy();
      });

      it('should redirect if no products available', () => {
        spyCall.and.returnValue(Observable.of([]));
        spyOn(router, 'navigate');

        component.ngOnInit();

        expect(itemService.getItemsWithAvailableProducts).toHaveBeenCalledWith([ITEM_ID]);
        expect(router.navigate).toHaveBeenCalledWith(['pro/catalog/list', {alreadyFeatured: true}])
      });
    });
  });
});
