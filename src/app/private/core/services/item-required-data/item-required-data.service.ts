import { NumberFormatStyle } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { ItemResponse } from '@core/item/item-response.interface';
import { environment } from '@environments/environment';
import { ObjectType, SizesResponse } from '@private/features/upload/core/models/brand-model.interface';
import { ACCEPT_HEADERS } from '@public/core/constants/header-constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CATEGORY_IDS_WITH_REQUIRED_SECOND_LEVEL_OBJECT_TYPE,
  ITEM_REQUIRED_FIELDS_BY_CATEGORY_ID,
} from './constants/item-required-data-constants';

export const SUGGESTERS_API_URL = 'api/v3/suggesters/general';
export const FASHION_KEYS_API_URL = 'api/v3/fashion/keys';
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
    if (CATEGORY_IDS_WITH_REQUIRED_SECOND_LEVEL_OBJECT_TYPE.includes(categoryId)) {
      this.hasToCheckForSecondLevelObjectType(categoryId, dataToCheck['extra_info']['object_type']['id']).subscribe(
        (hasToCheck: boolean) => {
          if (hasToCheck) {
            ITEM_REQUIRED_FIELDS_BY_CATEGORY_ID[categoryId].push('extra_info.object_type.parent_object_type.id');
          }
        }
      );
    }

    if (categoryId === CATEGORY_IDS.FASHION_ACCESSORIES) {
      this.hasToCheckForSize(dataToCheck['extra_info']['object_type']['id']).subscribe((hasToCheck: boolean) => {
        if (hasToCheck) {
          ITEM_REQUIRED_FIELDS_BY_CATEGORY_ID[categoryId].push('extra_info.size.id');
        }
      });
    }

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

  private hasToCheckForSecondLevelObjectType(categoryId: number, objectTypeId: number): Observable<boolean> {
    return this.getObjectTypes(categoryId, objectTypeId).pipe(
      map(
        (objectTypes: ObjectType[]) => {
          objectTypes = [null];
          return !!objectTypes.length;
        },
        () => {
          return false;
        }
      )
    );
  }

  private hasToCheckForSize(objectTypeId: number): Observable<boolean> {
    return this.getSizes(objectTypeId).pipe(
      map(
        (sizes: SizesResponse) => {
          return !!sizes.female;
        },
        () => {
          return false;
        }
      )
    );
  }

  private getObjectTypes(category_id: number, parent_id: number): Observable<ObjectType[]> {
    const headers = new HttpHeaders().set('Accept', ACCEPT_HEADERS.SUGGESTERS_V3);
    return this.http.get<ObjectType[]>(`${environment.baseUrl}${SUGGESTERS_API_URL}/object-type`, {
      params: {
        category_id,
        parent_id,
      } as any,
      headers,
    });
  }

  private getSizes(object_type_id: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${FASHION_KEYS_API_URL}/size`, {
      params: {
        object_type_id,
      } as any,
    });
  }
}
