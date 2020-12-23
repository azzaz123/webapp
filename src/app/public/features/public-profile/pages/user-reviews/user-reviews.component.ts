import { Component } from '@angular/core';
import { MapReviewService } from '@public/features/public-profile/pages/user-reviews/services/map-review/map-review.service';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { PaginationService } from '@public/core/services/pagination/pagination.service';
import { PaginationResponse } from '@public/core/services/pagination/pagination.interface';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'tsl-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.scss'],
})
export class UserReviewsComponent {
  public reviews = [];
  public nextPaginationItem: number = 0;
  public loading: boolean = true;

  constructor(
    private publicProfileService: PublicProfileService,
    private mapReviewService: MapReviewService,
    private paginationService: PaginationService
  ) {
    this.loadItems();
  }

  private loadItems(): void {
    this.loading = true;

    this.paginationService
      .getItems(
        this.publicProfileService.getReviews(
          this.publicProfileService.user.id,
          this.nextPaginationItem
        )
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((response: PaginationResponse) => {
        this.reviews = this.reviews.concat(
          this.mapReviewService.mapItems(response.results)
        );
        this.nextPaginationItem = response.init;
      });
  }

  loadMore(): void {
    this.loadItems();
  }
}
