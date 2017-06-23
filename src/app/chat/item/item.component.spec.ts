/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemComponent } from './item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ItemService, ITEM_COUNTERS_DATA, ITEM_FAVORITES, ITEM_VIEWS, MOCK_ITEM, Item } from 'shield';

describe('Component: Item', () => {

  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemComponent],
      providers: [{
        provide: ItemService, useValue: {
          getCounters() {
            return Observable.of(ITEM_COUNTERS_DATA);
          }
        }
      }],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ItemComponent);
    component = TestBed.createComponent(ItemComponent).componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('getCounters', () => {

    it('should add item counters', () => {
      component.item = <Item>{...MOCK_ITEM};
      component.ngOnChanges();
      expect(component.item.views).toBe(ITEM_VIEWS);
      expect(component.item.favorites).toBe(ITEM_FAVORITES);
    });

    it('should not add item counters', () => {
      component.item = <Item>{...MOCK_ITEM};
      component.item.views = 1000;
      component.item.favorites = 1000;
      component.ngOnChanges();
      expect(component.item.views).toBe(1000);
      expect(component.item.favorites).toBe(1000);
    });

  });

});
