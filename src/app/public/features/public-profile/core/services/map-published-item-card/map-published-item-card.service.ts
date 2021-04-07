import { Injectable } from '@angular/core';
import { ItemContent, ItemImagesURLs, ItemResponse } from '@core/item/item-response.interface';
import { Image } from '@core/user/user-response.interface';
import { UuidService } from '@core/uuid/uuid.service';
import { ItemCard } from '@public/core/interfaces/item-card-core.interface';

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
      salePrice: publishedItemRespone.price,
      images: !!publishedItemRespone.images?.length ? publishedItemRespone.images : [this.getMainImage(publishedItemRespone.image)],
      flags: publishedItemRespone.flags,
      bumpFlags: publishedItemRespone.visibility_flags,
      webSlug: publishedItemRespone.web_slug,
      currencyCode: publishedItemRespone.currency,
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
