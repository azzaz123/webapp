import { Component, OnInit } from '@angular/core';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { finalize, take } from 'rxjs/operators';
import { Review } from '@private/features/reviews/core/review';
import { EmptyStateProperties } from '@public/shared/components/empty-state/empty-state-properties.interface';
import { ReviewsApiService } from '@api/reviews/reviews-api.service';
import { PaginatedList } from '@api/core/model/paginated-list.interface';

@Component({
  selector: 'tsl-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.scss'],
})
export class UserReviewsComponent implements OnInit {
  public readonly emptyStateProperties: EmptyStateProperties = {
    title: $localize`:@@web_no_reviews_items_title:No reviews yet`,
    description: $localize`:@@web_no_reviews_items_description:This person hasn't received any reviews. Will yours be the first?`,
    illustrationSrc: '/assets/images/commons/balloon.svg',
  };
  public reviews: Review[] = [];
  public nextPaginationItem = '';
  public loading = true;

  constructor(private publicProfileService: PublicProfileService, private reviewsApiService: ReviewsApiService) {}

  public ngOnInit(): void {
    this.loadItems();
  }

  private loadItems(): void {
    this.loading = true;

    try {
      this.reviewsApiService
        .getUserReviews(this.publicProfileService.user.id, this.nextPaginationItem)
        .pipe(
          finalize(() => (this.loading = false)),
          take(1)
        )
        .subscribe((paginatedList: PaginatedList<Review>) => {
          this.reviews = this.reviews.concat(paginatedList.list);
          this.nextPaginationItem = paginatedList.paginationParameter;
        }, this.onError);
    } catch (err: any) {
      this.onError();
    }
  }

  public loadMore(): void {
    this.loadItems();
  }

  private onError(): void {
    this.reviews = [];
    this.loading = false;
  }
}
