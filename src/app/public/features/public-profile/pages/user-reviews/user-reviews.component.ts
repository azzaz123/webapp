import { Component, OnInit } from '@angular/core';
import { MapReviewService } from '@public/features/public-profile/pages/user-reviews/services/map-review/map-review.service';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { PaginationResponse } from '@public/core/services/pagination/pagination.interface';
import { finalize, take } from 'rxjs/operators';
import { Review } from '@private/features/reviews/core/review';
import { ReviewResponse } from '@private/features/reviews/core/review-response.interface';
import { EmptyStateProperties } from '@public/shared/components/empty-state/empty-state-properties.interface';

@Component({
  selector: 'tsl-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.scss'],
})
export class UserReviewsComponent implements OnInit {
  public readonly emptyStateProperties: EmptyStateProperties = {
    title: $localize`:@@NoReviewsItemsTitle:No reviews yet`,
    description: $localize`:@@NoReviewsItemsDescription:This person hasn't received any reviews. Will yours be the first?`,
    drawingPath: '/assets/images/dolls/balloon.svg',
  };
  public reviews: Review[] = [];
  public nextPaginationItem = 0;
  public loading = true;

  constructor(private publicProfileService: PublicProfileService, private mapReviewService: MapReviewService) {}

  public ngOnInit(): void {
    this.loadItems();
  }

  private loadItems(): void {
    this.loading = true;

    try {
      this.publicProfileService
        .getReviews(this.publicProfileService.user.id, this.nextPaginationItem)
        .pipe(
          finalize(() => (this.loading = false)),
          take(1)
        )
        .subscribe((response: PaginationResponse<ReviewResponse>) => {
          this.reviews = this.reviews.concat(this.mapReviewService.mapItems(response.results));
          this.nextPaginationItem = response.init;
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
