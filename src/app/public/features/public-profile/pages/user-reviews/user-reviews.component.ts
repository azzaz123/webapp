import { Component, OnDestroy } from '@angular/core';
import { MapReviewService } from '@public/features/public-profile/pages/user-reviews/services/map-review/map-review.service';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { PaginationService } from '@public/core/services/pagination/pagination.service';
import { PaginationResponse } from '@public/core/services/pagination/pagination.interface';
import { finalize, take } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'tsl-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.scss'],
})
export class UserReviewsComponent implements OnDestroy {
  public reviews = [];
  public nextPaginationItem = 0;
  public loading = true;

  private subscriptions: Subscription[] = [];

  constructor(
    private publicProfileService: PublicProfileService,
    private mapReviewService: MapReviewService,
    private paginationService: PaginationService
  ) {
    this.loadItems();
  }

  private loadItems(): void {
    this.loading = true;

    this.subscriptions.push(
      this.paginationService
        .getItems(
          this.publicProfileService.getReviews(
            this.publicProfileService.user.id,
            this.nextPaginationItem
          )
        )
        .pipe(
          finalize(() => (this.loading = false)),
          take(1)
        )
        .subscribe((response: PaginationResponse) => {
          this.reviews = this.reviews.concat(
            this.mapReviewService.mapItems(response.results)
          );
          this.nextPaginationItem = response.init;
        })
    );
  }

  public loadMore(): void {
    this.loadItems();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }
}
