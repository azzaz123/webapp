import { Injectable } from '@angular/core';
import { ItemContent, ItemContentImage, ItemResponse } from '@core/item/item-response.interface';
import { Image } from '@core/user/user-response.interface';
import { UuidService } from '@core/uuid/uuid.service';
import { ItemCard } from '@public/shared/components/item-card/interfaces/item-card.interface';

@Injectable({
  providedIn: 'root',
})
export class MapPublishedItemService {
  constructor(private uuidService: UuidService) {}

  public mapPublishedItems(publishedItemsResponse: ItemResponse[]): ItemCard[] {
    return publishedItemsResponse.map((itemResponse) => this.mapPublishedItem(itemResponse.content));
  }

  public mapPublishedItem(publishedItemRespone: ItemContent): ItemCard {
    return {
      id: publishedItemRespone.id,
      ownerId: publishedItemRespone.user.id,
      title: publishedItemRespone.title,
      description: publishedItemRespone.description,
      salePrice: publishedItemRespone.sale_price,
      mainImage: this.getMainImage(publishedItemRespone.images, publishedItemRespone.image),
      flags: publishedItemRespone.flags,
      bumpFlags: publishedItemRespone.visibility_flags,
    };
  }

  private getMainImage(images: Image[], image: ItemContentImage): Image {
    return images
      ? images[0]
      : {
          id: this.uuidService.getUUID(),
          original_width: image ? image.original_width : null,
          original_height: image ? image.original_height : null,
          average_hex_color: '',
          urls_by_size: image,
        };
  }
}
