import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { HttpClient } from '@angular/common/http';
import { PUBLISHED_ITEMS_ENDPOINT } from './endpoints';
import { CatalogPublicProfileItemsResponse } from './dtos/catalog-public-profile-items-response';
import { map } from 'rxjs/operators';
import { PublishedItemMapperService } from './mappers/published-item-mapper.service';

@Injectable()
export class CatalogApiService {
  constructor(private httpClient: HttpClient, private publishedItemMapperService: PublishedItemMapperService) {}

  public getUserPublishedItems(userId: string, next?: string): Observable<ItemCard[]> {
    return this.httpClient.get<CatalogPublicProfileItemsResponse>(PUBLISHED_ITEMS_ENDPOINT(userId)).pipe(
      map((response) => {
        return this.publishedItemMapperService.transform(response.data);
      })
    );
  }
}
