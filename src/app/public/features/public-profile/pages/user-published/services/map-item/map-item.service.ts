import { Injectable } from '@angular/core';
import { Car } from '@core/item/car';
import { Item, ITEM_TYPES } from '@core/item/item';
import {
  ItemResponse,
  ItemContent,
  CarContent,
  RealestateContent,
} from '@core/item/item-response.interface';
import { RecommenderItemImage } from '@public/core/services/api/recommender/interfaces/recommender-item.interface';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';
import { Image } from '@core/user/user-response.interface';
import { Realestate } from '@core/item/realestate';
import { UuidService } from '@core/uuid/uuid.service';

@Injectable()
export class MapItemService {
  constructor(private uuidService: UuidService) {}

  public mapItems(items: ItemResponse[]): Item[] {
    return items.map((itemResponse: ItemResponse) => {
      return this.mapItem(itemResponse);
    });
  }

  public mapItem(item: ItemResponse): Item {
    const content: ItemContent = item.content;
    if (item.type === 'cars') {
      return this.mapCar(content);
    } else if (item.type === 'real_estate') {
      return this.mapRealEstate(content);
    }
    return this.mapConsumerGoods(content);
  }

  private mapCar(content: CarContent): Car {
    return new Car(
      content.id,
      content.user.id,
      content.title,
      content.storytelling,
      content.sale_price === undefined ? content.price : content.sale_price,
      content.currency_code || content.currency,
      content.modified_date,
      content.url,
      content.flags,
      content.sale_conditions,
      content.images,
      content.web_slug,
      content.brand,
      content.model,
      content.year,
      content.gearbox,
      content.engine,
      content.color,
      content.horsepower,
      content.body_type,
      content.num_doors,
      content.extras,
      content.warranty,
      content.num_seats,
      content.condition,
      content.version,
      content.financed_price,
      content.publish_date,
      content.image,
      content.km
    );
  }

  private mapRealEstate(content: RealestateContent): Realestate {
    return new Realestate(
      content.id,
      content.user.id,
      content.title,
      content.storytelling,
      content.location,
      content.sale_price,
      content.currency_code,
      content.modified_date,
      content.url,
      content.flags,
      content.images,
      content.web_slug,
      content.operation,
      content.type,
      content.condition,
      content.surface,
      content.bathrooms,
      content.rooms,
      content.garage,
      content.terrace,
      content.elevator,
      content.pool,
      content.garden,
      content.image,
      content.publish_date
    );
  }

  private mapConsumerGoods(content: ItemContent): Item {
    return new Item(
      content.id,
      null,
      content.user.id,
      content.title,
      content.description,
      content.category_id,
      null,
      content.sale_price === undefined ? content.price : content.sale_price,
      content.currency_code || content.currency,
      content.modified_date,
      content.url,
      content.flags,
      null,
      content.sale_conditions,
      content.images
        ? content.images[0]
        : {
            id: this.uuidService.getUUID(),
            original_width: content.image ? content.image.original_width : null,
            original_height: content.image
              ? content.image.original_height
              : null,
            average_hex_color: '',
            urls_by_size: content.image,
          },
      content.images,
      content.web_slug,
      content.publish_date,
      content.delivery_info,
      ITEM_TYPES.CONSUMER_GOODS,
      content.extra_info
        ? {
            object_type: {
              id:
                content.extra_info.object_type &&
                content.extra_info.object_type.id
                  ? content.extra_info.object_type.id.toString()
                  : null,
              name:
                content.extra_info.object_type &&
                content.extra_info.object_type.name
                  ? content.extra_info.object_type.name
                  : null,
            },
            brand: content.extra_info.brand,
            model: content.extra_info.model,
            gender: content.extra_info.gender,
            size: {
              id:
                content.extra_info.size && content.extra_info.size.id
                  ? content.extra_info.size.id.toString()
                  : null,
            },
            condition: content.extra_info.condition || null,
          }
        : undefined
    );
  }

  public mapRecommendedItem(
    recommendedItemBodyResponse: RecommendedItemsBodyResponse
  ): Item[] {
    return recommendedItemBodyResponse.recommended_items.map(
      (recommendedItem) => {
        return new Item(
          recommendedItem.id,
          null,
          recommendedItem.seller_id,
          recommendedItem.title,
          null,
          recommendedItem.category_id,
          null,
          recommendedItem.price,
          recommendedItem.currency,
          null,
          null,
          {
            pending: null,
            sold: null,
            favorite: recommendedItem.favorited,
            reserved: null,
            banned: null,
            expired: null,
          },
          null,
          {
            fix_price: null,
            exchange_allowed: null,
            shipping_allowed: recommendedItem.shipping_allowed,
          },
          !this.mapRecommendedItemImages(recommendedItem.images)
            ? null
            : this.mapRecommendedItemImages(recommendedItem.images)[0],
          this.mapRecommendedItemImages(recommendedItem.images),
          recommendedItem.web_slug,
          null,
          null,
          recommendedItemBodyResponse.recommended_type
        );
      }
    );
  }

  private mapRecommendedItemImages(
    recommendedItemImages: RecommenderItemImage[]
  ): Image[] {
    if (recommendedItemImages?.length === 0 || !recommendedItemImages?.length) {
      return null;
    } else if (recommendedItemImages?.length === 1) {
      return [this.mapRecommendedImage(recommendedItemImages[0])];
    } else {
      return recommendedItemImages.map((image: RecommenderItemImage) => {
        return this.mapRecommendedImage(image);
      });
    }
  }

  private mapRecommendedImage(image: RecommenderItemImage): Image {
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
