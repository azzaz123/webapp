import { Injectable } from '@angular/core';
import { Image } from '@core/user/user-response.interface';
import { UuidService } from '@core/uuid/uuid.service';
import { RecommenderItem, RecommenderItemImage } from '@public/core/services/api/recommender/interfaces/recommender-item.interface';
import { ItemCard } from '@public/shared/components/item-card/interfaces/item-card.interface';

@Injectable({
  providedIn: 'root',
})
export class MapRecommendedItemCardService {
  constructor(private uuidService: UuidService) {}

  public mapRecommendedItems(recommendedItems: RecommenderItem[]): ItemCard[] {
    return recommendedItems.map((recommendedItem) => this.mapRecommendedItem(recommendedItem));
  }

  private mapRecommendedItem(recommendedItem: RecommenderItem): ItemCard {
    return {
      id: recommendedItem.id,
      ownerId: recommendedItem.seller_id,
      title: recommendedItem.title,
      salePrice: recommendedItem.price,
      mainImage: recommendedItem.images.length ? this.getMainImage(recommendedItem.images[0]) : null,
      webSlug: recommendedItem.web_slug,
    };
  }

  private getMainImage(image: RecommenderItemImage): Image {
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
