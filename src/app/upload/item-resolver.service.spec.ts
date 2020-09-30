import { TestBed } from '@angular/core/testing';

import { ItemResolverService } from './item-resolver.service';
import { ItemService } from '../core/item/item.service';
import { of } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ITEM_ID, MOCK_ITEM } from '../../tests/item.fixtures.spec';
import { Item } from '../core/item/item';

describe('ItemResolverService', () => {

  let service: ItemResolverService;
  let itemService: ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ItemResolverService,
        {
          provide: ItemService, useValue: {
          get() {
            return of(MOCK_ITEM);
          }
        }
        }
      ]
    });
    service = TestBed.inject(ItemResolverService);
    itemService = TestBed.inject(ItemService);
  });

  it('should return Observable with item', () => {
    let itemReturned: Item;
    const route = new ActivatedRouteSnapshot();
    spyOn(itemService, 'get').and.callThrough();
    spyOn(route.paramMap, 'get').and.returnValue(ITEM_ID);

    service.resolve(route).subscribe((item: Item) => {
      itemReturned = item;
    });

    expect(route.paramMap.get).toHaveBeenCalledWith('id');
    expect(itemService.get).toHaveBeenCalledWith(ITEM_ID);
    expect(itemReturned).toEqual(MOCK_ITEM);
  });
});
