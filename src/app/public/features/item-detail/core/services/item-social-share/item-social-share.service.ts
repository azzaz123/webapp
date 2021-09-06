import { Injectable } from '@angular/core';
import { Item } from '@core/item/item';
import { SocialMetaTagService } from '@core/social-meta-tag/social-meta-tag.service';
import { ItemDetailRoutePipe } from '@shared/pipes';

@Injectable()
export class ItemSocialShareService {
  constructor(private socialMetaTagService: SocialMetaTagService, private itemDetailRoutePipe: ItemDetailRoutePipe) {}

  public initializeItemMetaTags(item: Item): void {
    const itemLink = this.itemDetailRoutePipe.transform(item.webSlug);

    this.socialMetaTagService.insertTwitterMetaTags(item.title, item.description, item.mainImage?.urls_by_size?.medium);
    this.socialMetaTagService.insertFacebookMetaTags(item.title, item.description, item.mainImage?.urls_by_size?.medium, itemLink);
  }
}
