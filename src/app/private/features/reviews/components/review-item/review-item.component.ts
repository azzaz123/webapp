import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { CategoryService } from 'app/core/category/category.service';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from 'app/core/item/item';
import { Review } from '../../core/review';

@Component({
  selector: 'tsl-review-item',
  templateUrl: './review-item.component.html',
  styleUrls: ['./review-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewItemComponent implements OnInit {
  @Input() isOwner = true;
  @Input() review: Review;
  public fallback: string;
  public itemWebLink: string;
  public userWebSlug: string;

  constructor(@Inject('SUBDOMAIN') private subdomain: string, public categoryService: CategoryService) {}

  ngOnInit() {
    this.fallback = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
    this.itemWebLink = this.review.item ? this.review.item.getUrl(this.subdomain) : null;
    this.userWebSlug = this.review.user ? this.review.user.getUrl(this.subdomain) : null;
  }

  get soldCopy(): string {
    return this.isOwner ? $localize`:@@OwnReview_Sold:Sold` : $localize`:@@Review_Sold:Sold`;
  }

  get boughtCopy(): string {
    return this.isOwner ? $localize`:@@OwnReview_Bought:Bought` : $localize`:@@Review_Bought:Bought`;
  }
}
