import { Component, Input, OnInit } from '@angular/core';
import { Item } from '@core/item/item';
import { SocialMetaTagService } from '@core/social-meta-tag/social-meta-tag.service';
import { SocialShare } from '../../interfaces/social-share.interface';

@Component({
  selector: 'tsl-item-social-share',
  templateUrl: './item-social-share.component.html',
})
export class ItemSocialShareComponent implements OnInit {
  @Input() socialShare: SocialShare;
  @Input() item: Item;

  constructor(private socialMetaTagsService: SocialMetaTagService) {}

  ngOnInit(): void {
    if (this.item) {
      this.initializeItemMetaTags();
    }
  }

  private initializeItemMetaTags(): void {
    this.socialMetaTagsService.insertTwitterMetaTags(this.item.title, this.item.description, this.item.mainImage?.urls_by_size?.medium);
    this.socialMetaTagsService.insertFacebookMetaTags(
      this.item.title,
      this.item.description,
      this.item.mainImage?.urls_by_size?.medium,
      this.item.webLink
    );
  }
}
