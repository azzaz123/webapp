import { Injectable } from '@angular/core';
import { ItemContent, ItemContentImage, ItemResponse } from '@core/item/item-response.interface';
import { Image } from '@core/user/user-response.interface';
import { UuidService } from '@core/uuid/uuid.service';
import { ItemCard } from '@public/shared/components/item-card/interfaces/item-card.interface';

@Injectable({
  providedIn: 'root',
})
export class MapPublishedItemCardService {
  constructor(private uuidService: UuidService) {}

  public mapPublishedItems(publishedItemsResponse: ItemResponse[]): ItemCard[] {
    return publishedItemsResponse?.map((itemResponse) => this.mapPublishedItem(itemResponse.content));
  }

  private mapPublishedItem(publishedItemRespone: ItemContent): ItemCard {
    return {
      id: publishedItemRespone.id,
      ownerId: publishedItemRespone.user.id,
      title: publishedItemRespone.title,
      description: publishedItemRespone.description,
      salePrice: publishedItemRespone.sale_price,
      mainImage: this.getMainImage(publishedItemRespone.images, publishedItemRespone.image),
      flags: publishedItemRespone.flags,
      bumpFlags: publishedItemRespone.visibility_flags,
      webSlug: publishedItemRespone.web_slug,
    };
  }

  private getMainImage(images: Image[], image: ItemContentImage): Image {
    return images?.length
      ? images[0]
      : {
          id: this.uuidService.getUUID(),
          original_width: image?.original_width || null,
          original_height: image?.original_height || null,
          average_hex_color: '',
          urls_by_size: image,
        };
  }
}
