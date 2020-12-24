import { Component, OnDestroy } from '@angular/core';
import { PaginationResponse } from '@public/core/services/pagination/pagination.interface';
import { PaginationService } from '@public/core/services/pagination/pagination.service';
import { Subscription } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { PublicProfileService } from '../../core/services/public-profile.service';

@Component({
  selector: 'tsl-user-published',
  templateUrl: './user-published.component.html',
  styleUrls: ['./user-published.component.scss'],
})
export class UserPublishedComponent implements OnDestroy {
  public items = [];
  public nextPaginationItem = 0;
  public loading = true;

  private subscriptions: Subscription[] = [];

  constructor(
    private publicProfileService: PublicProfileService,
    private paginationService: PaginationService
  ) {
    this.loadItems();
  }

  private loadItems(): void {
    this.loading = true;

    this.subscriptions.push(
      this.paginationService
        .getItems(
          this.publicProfileService.getPublishedItems(
            this.publicProfileService.user.id,
            this.nextPaginationItem
          )
        )
        .pipe(
          finalize(() => (this.loading = false)),
          take(1)
        )
        .subscribe((response: PaginationResponse) => {
          this.items = this.items.concat(response.results);
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
