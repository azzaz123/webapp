import { Component, Inject, Input, OnInit } from '@angular/core';
import { CategoryResponse } from 'app/core/category/category-response.interface';
import { CategoryService } from 'app/core/category/category.service';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from 'app/core/item/item';
import { Review } from '../../core/review';

@Component({
  selector: 'tsl-review-item',
  templateUrl: './review-item.component.html',
  styleUrls: ['./review-item.component.scss'],
})
export class ReviewItemComponent implements OnInit {
  @Input() review: Review;
  public fallback: string;
  public itemWebLink: string;
  public userWebSlug: string;
  public category: CategoryResponse;

  constructor(
    @Inject('SUBDOMAIN') private subdomain: string,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.fallback = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
    this.itemWebLink = this.review.item
      ? this.review.item.getUrl(this.subdomain)
      : null;
    this.userWebSlug = this.review.user
      ? this.review.user.getUrl(this.subdomain)
      : null;

    this.categoryService
      .getCategoryById(this.review.item.categoryId)
      .subscribe((category: CategoryResponse) => {
        this.category = category;
      });
  }
}
