import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Item } from 'shield';
import { ItemService } from '../core/item/item.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ItemResolverService implements Resolve<Item> {

  constructor(private itemService: ItemService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Item> {
    return this.itemService.get(route.paramMap.get('id'));
  }

}
