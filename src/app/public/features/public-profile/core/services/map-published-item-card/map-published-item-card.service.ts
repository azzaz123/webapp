import { Injectable } from '@angular/core';
import { ItemContent, ItemImagesURLs, ItemResponse } from '@core/item/item-response.interface';
import { Image } from '@core/user/user-response.interface';
import { UuidService } from '@core/uuid/uuid.service';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { ItemFavouritesService } from '@public/core/services/item-favourites/item-favourites.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MapPublishedItemCardService {
  constructor(private uuidService: UuidService, private itemFavouritesService: ItemFavouritesService) {}

  public mapPublishedItemsFavouriteCheck(publishedItemsResponse: ItemResponse[]): Observable<ItemCard[]> {
    const itemsId = publishedItemsResponse.map((item: ItemResponse) => item.id);
    return this.itemFavouritesService.getFavouritedItemIds(itemsId).pipe(
      map((favouriteIds: string[]) => {
        const itemsFavouriteChecked = publishedItemsResponse?.map((item: ItemResponse) => {
          if (favouriteIds.includes(item.id)) {
            item.content.flags.favorite = true;
          }
          return item;
        });
        return this.mapPublishedItems(itemsFavouriteChecked);
      })
    );
  }

  public mapPublishedItems(publishedItemsResponse: ItemResponse[]): ItemCard[] {
    return publishedItemsResponse?.map((itemResponse) => this.mapPublishedItem(itemResponse.content));
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
