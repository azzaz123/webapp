import { Component, OnInit } from '@angular/core';
import { ItemResponse } from '@core/item/item-response.interface';
import { ItemCard } from '@public/core/interfaces/item-card-core.interface';
import { PaginationResponse } from '@public/core/services/pagination/pagination.interface';
import { finalize, take } from 'rxjs/operators';
import { MapPublishedItemCardService } from '../../core/services/map-published-item-card/map-published-item-card.service';
import { PublicProfileService } from '../../core/services/public-profile.service';

@Component({
  selector: 'tsl-user-published',
  templateUrl: './user-published.component.html',
  styleUrls: ['./user-published.component.scss'],
})
export class UserPublishedComponent implements OnInit {
  public items: ItemCard[] = [];
  public nextPaginationItem = 0;
  public loading = true;

  constructor(private publicProfileService: PublicProfileService, private mapPublishedItemCardService: MapPublishedItemCardService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  private loadItems(): void {
    this.loading = true;

    try {
      this.publicProfileService
        .getPublishedItems(this.publicProfileService.user.id, this.nextPaginationItem)
        .pipe(
          finalize(() => (this.loading = false)),
          take(1)
        )
        .subscribe((response: PaginationResponse<ItemResponse>) => {
          this.items = this.items.concat(this.mapPublishedItemCardService.mapPublishedItems(response.results));
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
    this.items = [];
    this.loading = false;
  }
}
