import { Component, Input, OnDestroy } from '@angular/core';
import { Item } from '@core/item/item';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '@core/profile/profile';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ItemCardService } from './services/item-card.service';

@Component({
  selector: 'tsl-public-ItemCard',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent implements OnDestroy {
  @Input() item: Item;
  @Input() showDescription = true;
  public readonly IMAGE_FALLBACK = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
  private subscriptions: Subscription[] = [];

  constructor(private itemCardService: ItemCardService) {}

  toggleFavourite(): void {
    this.item.flags.favorite = !this.item.flags.favorite;

    this.subscriptions.push(
      (this.item.flags.favorite
        ? this.itemCardService.markAsFavourite(this.item.id)
        : this.itemCardService.unmarkAsFavourite(this.item.id)
      )
        .pipe(take(1))
        .subscribe(
          () => {},
          () => {
            this.item.flags.favorite = !this.item.flags.favorite;
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }
}
