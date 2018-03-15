/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemComponent } from './item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ITEM_COUNTERS_DATA, ITEM_FAVORITES, ITEM_VIEWS, ITEM_WEB_SLUG, ItemService, MOCK_ITEM } from 'shield';
import { DecimalPipe } from '@angular/common';
import { CustomCurrencyPipe } from '../../shared/custom-currency/custom-currency.pipe';

describe('Component: Item', () => {

  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemComponent, CustomCurrencyPipe],
      providers: [
        DecimalPipe,
        {
          provide: ItemService, useValue: {
          getCounters() {
            return Observable.of(ITEM_COUNTERS_DATA);
          }
        }
        },
        {provide: 'SUBDOMAIN', useValue: 'es'}],
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
      component.item = MOCK_ITEM;
      component.ngOnChanges();
      expect(component.item.views).toBe(ITEM_VIEWS);
      expect(component.item.favorites).toBe(ITEM_FAVORITES);
    });

    it('should not add item counters', () => {
      component.item = MOCK_ITEM;
      component.item.views = 1000;
      component.item.favorites = 1000;
      component.ngOnChanges();
      expect(component.item.views).toBe(1000);
      expect(component.item.favorites).toBe(1000);
    });

  });

  it('should set itemUrl', () => {
    component.item = MOCK_ITEM;
    component.ngOnChanges();
    expect(component.itemUrl).toBe('https://es.wallapop.com/item/' + ITEM_WEB_SLUG);
  });

  describe('prevent', () => {

    it('should call preventdefault for the event when itemUrl is "#"', () => {
      const event = new Event('MouseEvent');
      component.itemUrl = '#';
      spyOn(event, 'preventDefault');

      component.prevent(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should NOT call preventdefault for the event when itemUrl is not "#"', () => {
      const event = new Event('MouseEvent');
      component.itemUrl = '/some-other-url';
      spyOn(event, 'preventDefault');

      component.prevent(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('stopPropagation', () => {

    it('should call stopPropagation for the event when invoked', () => {
      const event = new Event('MouseEvent');
      spyOn(event, 'stopPropagation');

      component.stopPropagation(event);

      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

});
