import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutComponent } from './checkout.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { Observable } from 'rxjs/Observable';
import { ITEMS_WITH_PRODUCTS } from '../../../tests/item.fixtures';
import { EventService } from '../../core/event/event.service';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let itemService: ItemService;
  let eventService: EventService;

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
          provide: EventService, useValue: {
          emit() {
          }
        }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    itemService = TestBed.get(ItemService);
    eventService = TestBed.get(EventService);
    spyOn(itemService, 'getItemsWithAvailableProducts').and.callThrough();
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should call getItemsWithAvailableProducts and set it', () => {
      expect(itemService.getItemsWithAvailableProducts).toHaveBeenCalledWith(SELECTED_ITEMS);
      expect(component.itemsWithProducts).toEqual(ITEMS_WITH_PRODUCTS);
    });
  });

  describe('showTutorial', () => {
    it('should emit the show tutorial event', () => {
      spyOn(eventService, 'emit');

      component.showTutorial();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.SHOW_BUMP_TUTORIAL);
    });
  });
});
