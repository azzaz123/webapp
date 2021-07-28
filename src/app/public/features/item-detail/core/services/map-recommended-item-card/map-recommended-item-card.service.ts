import { Injectable } from '@angular/core';
import { Image } from '@core/user/user-response.interface';
import { UuidService } from '@core/uuid/uuid.service';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { RecommenderItem, RecommenderItemImage } from '@public/core/services/api/recommender/interfaces/recommender-item.interface';
import { ItemFavouritesService } from '@public/core/services/item-favourites/item-favourites.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MapRecommendedItemCardService {
  constructor(private uuidService: UuidService, private itemFavouritesService: ItemFavouritesService) {}

  public mapRecommendedItemsFavouriteCheck(recommendedItems: RecommenderItem[]): Observable<ItemCard[]> {
    const itemsId = recommendedItems.map((item: RecommenderItem) => item.id);
    return this.itemFavouritesService.getFavouritedItemIds(itemsId).pipe(
      map((favouriteIds: string[]) => {
        const itemsFavouriteChecked = recommendedItems?.map((item: RecommenderItem) => {
          if (favouriteIds.includes(item.id)) {
            item.favorited = true;
          }
          return item;
        });

        return this.mapRecommendedItems(itemsFavouriteChecked);
      })
    );
  }

  public mapRecommendedItems(recommendedItems: RecommenderItem[]): ItemCard[] {
    return recommendedItems?.map((recommendedItem) => this.mapRecommendedItem(recommendedItem));
  }

  private mapRecommendedItem(recommendedItem: RecommenderItem): ItemCard {
    return {
      id: recommendedItem.id,
      categoryId: recommendedItem.category_id,
      ownerId: recommendedItem.seller_id,
      title: recommendedItem.title,
      salePrice: recommendedItem.price,
      images: recommendedItem.images?.map((image) => this.getImage(image)),
      webSlug: recommendedItem.web_slug,
      currencyCode: recommendedItem.currency,
      flags: {
        pending: false,
        sold: false,
        favorite: recommendedItem.favorited,
        reserved: false,
        banned: false,
        expired: false,
      },
    };
  }

  private getImage(image: RecommenderItemImage): Image {
    return {
      id: this.uuidService.getUUID(),
      original_width: image.original_width,
      original_height: image.original_height,
      average_hex_color: '',
      urls_by_size: {
        original: image.original,
        small: image.small,
        large: image.large,
        medium: image.medium,
        xlarge: image.xlarge,
      },
    };
  }
}
