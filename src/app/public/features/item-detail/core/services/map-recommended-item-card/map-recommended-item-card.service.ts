import { Injectable } from '@angular/core';
import { mapImageDtosToImages } from '@api/core/mappers';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { RecommenderItem } from '@public/core/services/api/recommender/interfaces/recommender-item.interface';

@Injectable()
export class MapRecommendedItemCardService {
  public mapRecommendedItemsFavouriteCheck(recommendedItems: RecommenderItem[]): ItemCard[] {
    return recommendedItems.map((item: RecommenderItem) => this.mapRecommendedItem(item));
  }

  private mapRecommendedItem(recommendedItem: RecommenderItem): ItemCard {
    return {
      id: recommendedItem.id,
      categoryId: Number.parseInt(recommendedItem.category_id),
      ownerId: recommendedItem.user_id,
      title: recommendedItem.title,
      salePrice: recommendedItem.price.amount,
      images: mapImageDtosToImages(recommendedItem.images || []),
      webSlug: recommendedItem.slug,
      currencyCode: recommendedItem.price.currency,
      flags: {
        pending: false,
        sold: false,
        favorite: !!recommendedItem?.favorited?.flag,
        reserved: false,
        banned: false,
        expired: false,
      },
    };
  }
}
