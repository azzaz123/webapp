import { Injectable } from '@angular/core';
import { Item } from '@core/item/item';
import { SocialMetaTagService } from '@core/social-meta-tag/social-meta-tag.service';

@Injectable()
export class ItemSocialShareService {
  constructor(private socialMetaTagService: SocialMetaTagService) {}

  public initializeItemMetaTags(item: Item): void {
    this.socialMetaTagService.insertTwitterMetaTags(item.title, item.description, item.mainImage?.urls_by_size?.medium);
    this.socialMetaTagService.insertFacebookMetaTags(item.title, item.description, item.mainImage?.urls_by_size?.medium, item.webLink);
  }
}
