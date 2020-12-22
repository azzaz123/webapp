import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ItemService } from '../../../../core/item/item.service';
import { Observable } from 'rxjs';
import { Item } from '../../../../core/item/item';

@Injectable()
export class ItemResolverService implements Resolve<Item> {
  constructor(private itemService: ItemService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Item> {
    return this.itemService.get(route.paramMap.get('id'));
  }
}
