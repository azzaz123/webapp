import { TestBed } from '@angular/core/testing';

import { ItemResolverService } from './item-resolver.service';
import { ItemService } from '../core/item/item.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Item, ITEM_ID, MOCK_ITEM } from 'shield';
import { RouterTestingModule } from '@angular/router/testing';

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
            return Observable.of(MOCK_ITEM);
          }
        }
        }
      ]
    });
    service = TestBed.get(ItemResolverService);
    itemService = TestBed.get(ItemService);
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
