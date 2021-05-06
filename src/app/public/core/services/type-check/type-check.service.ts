import { Injectable } from '@angular/core';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { Car } from '@core/item/car';
import { Item } from '@core/item/item';
import { Realestate } from '@core/item/realestate';
import { Size } from '@private/features/upload/core/models/brand-model.interface';

@Injectable({
  providedIn: 'root',
})
export class TypeCheckService {
  public isNumber(label: unknown): label is number {
    return typeof label === 'number';
  }

  public isBoolean(label: unknown): label is boolean {
    return typeof label === 'boolean';
  }

  public isCar(item: unknown): item is Car {
    return item instanceof Car;
  }

  public isRealEstate(item: unknown): item is Realestate {
    return item instanceof Realestate;
  }

  public isFashion(item: Item): boolean {
    return item?.categoryId === CATEGORY_IDS.FASHION_ACCESSORIES;
  }

  public isCellPhoneAccessories(item: Item): boolean {
    return item?.categoryId === CATEGORY_IDS.CELL_PHONES_ACCESSORIES;
  }

  public isSize(property: unknown): property is Size {
    return typeof property === 'object' && property !== null ? 'text' in property && 'id' in property : false;
  }

  public isItem(item: unknown): item is Item {
    return item instanceof Item;
  }
}
