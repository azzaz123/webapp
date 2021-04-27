import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemResponse } from '@core/item/item-response.interface';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { ITEM_REQUIRED_FIELDS_BY_CATEGORY_ID } from './constants/item-required-data-constants';

export interface Item {}

export const ITEMS_API_URL = (itemId: string) => `${environment.baseUrl}api/v3/items/${itemId}`;
export const GET_ITEM_ENDPOINT = (id: string) => `${ITEMS_API_URL(id)}`;

@Injectable()
export class ItemRequiredDataService {
  constructor(private http: HttpClient) {}

  public hasMissingRequiredDataByItemId(itemId: string): any {
    return this.http.get<ItemResponse>(GET_ITEM_ENDPOINT(itemId)).pipe(
      map(
        (item: ItemResponse) => {
          try {
            return !this.hasRequiredData(item.content, item.content.category_id);
          } catch (e) {
            return true;
          }
        },
        () => {
          return true;
        }
      )
    );
  }

  private hasRequiredData(dataToCheck: Object, categoryId: number): boolean {
    return ITEM_REQUIRED_FIELDS_BY_CATEGORY_ID[categoryId].every((fieldComposedName: string) => {
      const fieldNames = fieldComposedName.split('.');
      const fieldLevelCount = fieldNames.length;
      let value: unknown = dataToCheck;

      for (let i = 0; i < fieldLevelCount; i++) {
        value = this.getValue(value, fieldNames[i]);
      }

      return !!value;
    });
  }

  private getValue(object: Object, propertyName: string): Object | string {
    return object[propertyName];
  }
}
