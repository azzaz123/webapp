import { Injectable } from '@angular/core';
import { ItemContent, ItemImagesURLs, ItemResponse } from '@core/item/item-response.interface';
import { Image } from '@core/user/user-response.interface';
import { UuidService } from '@core/uuid/uuid.service';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { FavoritesApiService } from '@public/core/services/api/favorites/favorites-api.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class MapPublishedItemCardService {
  constructor(
    private uuidService: UuidService,
    private checkSessionService: CheckSessionService,
    private favoritesApiService: FavoritesApiService
  ) {}

  public mapPublishedItems(publishedItemsResponse: ItemResponse[]): Observable<ItemCard[]> {
    return this.getFavouritedItemIds(publishedItemsResponse).pipe(
      map((favoriteIds: string[]) => {
        const itemsFavouriteChecked = publishedItemsResponse?.map((item: ItemResponse) => {
          if (favoriteIds.includes(item.id)) {
            item.content.flags.favorite = true;
          }
          return item;
        });
        return itemsFavouriteChecked?.map((itemResponse: ItemResponse) => this.mapPublishedItem(itemResponse.content));
      })
    );
  }

  private getFavouritedItemIds(itemsResponse: ItemResponse[]): Observable<string[]> {
    const itemsId = itemsResponse.map((item) => item.id);

    // TODO: check if not our own user		Date: 2021/04/08
    if (this.checkSessionService.hasSession()) {
      return this.favoritesApiService.getFavoriteItemsId(itemsId).pipe(catchError(() => of([])));
    }
    return of([]);
  }

  private mapPublishedItem(publishedItemResponse: ItemContent): ItemCard {
    return {
      id: publishedItemResponse.id,
      ownerId: publishedItemResponse.user.id,
      title: publishedItemResponse.title,
      description: publishedItemResponse.description,
      salePrice: publishedItemResponse.price,
      images: !!publishedItemResponse.images?.length ? publishedItemResponse.images : [this.getMainImage(publishedItemResponse.image)],
      flags: publishedItemResponse.flags,
      bumpFlags: publishedItemResponse.visibility_flags,
      webSlug: publishedItemResponse.web_slug,
      currencyCode: publishedItemResponse.currency,
    };
  }

  private getMainImage(imageURLs: ItemImagesURLs): Image {
    return {
      id: this.uuidService.getUUID(),
      original_width: imageURLs?.original_width || null,
      original_height: imageURLs?.original_height || null,
      average_hex_color: '',
      urls_by_size: imageURLs,
    };
  }
}
