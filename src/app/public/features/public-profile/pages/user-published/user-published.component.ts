import { Component, OnInit } from '@angular/core';
import { Item } from '@core/item/item';
import { PaginationResponse } from '@public/core/services/pagination/pagination.interface';
import { PaginationService } from '@public/core/services/pagination/pagination.service';
import { finalize, take } from 'rxjs/operators';
import { PublicProfileService } from '../../core/services/public-profile.service';

@Component({
  selector: 'tsl-user-published',
  templateUrl: './user-published.component.html',
  styleUrls: ['./user-published.component.scss'],
})
export class UserPublishedComponent implements OnInit {
  public items: Item[] = [];
  public nextPaginationItem = 0;
  public loading = true;

  constructor(
    private publicProfileService: PublicProfileService,
    private paginationService: PaginationService
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  private loadItems(): void {
    this.loading = true;

    try {
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
        .subscribe(
          (response: PaginationResponse<Item>) => {
            this.items = this.items.concat(response.results);
            this.nextPaginationItem = response.init;
          },
          () => {
            this.onError();
          }
        );
    } catch (err: any) {
      this.onError();
    }
  }

  public loadMore(): void {
    this.loadItems();
  }

  private onError(): void {
    this.items = [];
    this.loading = false;
  }
}
