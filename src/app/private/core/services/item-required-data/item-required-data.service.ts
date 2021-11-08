import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { ITEM_TYPES } from '@core/item/item';
import { ItemResponse } from '@core/item/item-response.interface';
import { environment } from '@environments/environment';
import { ObjectType, SizesResponse } from '@private/features/upload/core/models/brand-model.interface';
import { ACCEPT_HEADERS } from '@public/core/constants/header-constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITEM_DATA_FIELD } from './constants/item-data-field-constants';
import {
  CATEGORY_IDS_WITH_REQUIRED_SECOND_LEVEL_OBJECT_TYPE,
  ITEM_REQUIRED_FIELDS_BY_CATEGORY_ID,
} from './constants/item-required-data-constants';

export const OBJECT_TYPE_API_URL = 'api/v3/suggesters/general/object-type';
export const FASHION_SIZE_KEYS_API_URL = 'api/v3/fashion/keys/size';
export const ITEMS_API_URL = (itemId: string) => `${environment.baseUrl}api/v3/items/${itemId}`;
export const GET_ITEM_ENDPOINT = (id: string) => `${ITEMS_API_URL(id)}/vertical`;

@Injectable()
export class ItemRequiredDataService {
  constructor(private http: HttpClient) {}

  public hasMissingRequiredDataByItemId(itemId: string): Observable<boolean> {
    return this.getItem(itemId).pipe(
      map(
        (item: ItemResponse) => {
          try {
            let categoryId = item.content.category_id;

            if (!categoryId) {
              if (item.type === ITEM_TYPES.CARS) {
                categoryId = CATEGORY_IDS.CAR;
              }

              if (item.type === ITEM_TYPES.REAL_ESTATE) {
                categoryId = CATEGORY_IDS.REAL_ESTATE;
              }
            }
            return !this.hasRequiredData(item.content, categoryId);
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
      this.hasToCheckForSecondLevelObjectType(
        categoryId,
        dataToCheck[ITEM_DATA_FIELD.EXTRA_INFO][ITEM_DATA_FIELD.OBJECT_TYPE][ITEM_DATA_FIELD.ID]
      ).subscribe((hasToCheck: boolean) => {
        if (hasToCheck) {
          ITEM_REQUIRED_FIELDS_BY_CATEGORY_ID[categoryId].push(
            `${ITEM_DATA_FIELD.EXTRA_INFO}.${ITEM_DATA_FIELD.OBJECT_TYPE}.${ITEM_DATA_FIELD.PARENT_OBJECT_TYPE}.${ITEM_DATA_FIELD.ID}`
          );
        }
      });
    }

    if (categoryId === CATEGORY_IDS.FASHION_ACCESSORIES) {
      this.hasToCheckForSize(dataToCheck[ITEM_DATA_FIELD.EXTRA_INFO][ITEM_DATA_FIELD.OBJECT_TYPE][ITEM_DATA_FIELD.ID]).subscribe(
        (hasToCheck: boolean) => {
          if (hasToCheck) {
            ITEM_REQUIRED_FIELDS_BY_CATEGORY_ID[categoryId].push(
              `${ITEM_DATA_FIELD.EXTRA_INFO}.${ITEM_DATA_FIELD.SIZE}.${ITEM_DATA_FIELD.ID}`
            );
          }
        }
      );
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

  private getItem(itemId: string): Observable<ItemResponse> {
    return this.http.get<ItemResponse>(GET_ITEM_ENDPOINT(itemId));
  }

  private getObjectTypes(category_id: number, parent_id: number): Observable<ObjectType[]> {
    const headers = new HttpHeaders().set('Accept', ACCEPT_HEADERS.SUGGESTERS_V3);
    return this.http.get<ObjectType[]>(`${environment.baseUrl}${OBJECT_TYPE_API_URL}`, {
      params: {
        category_id,
        parent_id,
      } as any,
      headers,
    });
  }

  private getSizes(object_type_id: number): Observable<SizesResponse> {
    return this.http.get<SizesResponse>(`${environment.baseUrl}${FASHION_SIZE_KEYS_API_URL}`, {
      params: {
        object_type_id,
      } as any,
    });
  }
}
