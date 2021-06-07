import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PUBLISHED_ITEMS_ENDPOINT } from './endpoints';
import { CatalogPublicProfileItemsResponse } from './dtos/catalog-public-profile-items-response';
import { map } from 'rxjs/operators';
import { PublishedItemMapperService } from './mappers/published-item-mapper.service';
import { PaginatedList } from '../core/model/paginated-list.interface';
import { ACCEPTED_PARAMETERS } from './enums/accepted-parameters.enum';

@Injectable()
export class CatalogApiService {
  constructor(private httpClient: HttpClient, private publishedItemMapperService: PublishedItemMapperService) {}

  // TODO: For now this service maps the response to ItemCard model, as it is currently the common model on the public domain. We need to
  //       port this to an "Item" model once we have a decent definition of the item domain.
  public getUserPublishedItems(userId: string, nextId?: string): Observable<PaginatedList<ItemCard>> {
    let params = new HttpParams();

    if (nextId) {
      params = params.append(ACCEPTED_PARAMETERS.SINCE, nextId);
    }

    return this.httpClient
      .get<CatalogPublicProfileItemsResponse>(PUBLISHED_ITEMS_ENDPOINT(userId), {
        params,
      })
      .pipe(
        map((response) => {
          return {
            list: this.publishedItemMapperService.transform(response.data),
            nextId: response.meta.next,
          };
        })
      );
  }
}
