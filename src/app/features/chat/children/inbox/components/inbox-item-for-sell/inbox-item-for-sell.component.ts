import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ItemDataResponse } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { InboxUser } from '@features/chat/core/model';

@Component({
  selector: 'tsl-inbox-item-for-sell',
  templateUrl: './inbox-item-for-sell.component.html',
  styleUrls: ['./inbox-item-for-sell.component.scss'],
})
export class InboxItemForSellComponent implements OnChanges {
  @Input() user: InboxUser;

  constructor(private itemService: ItemService) {}

  ngOnChanges(changes?: SimpleChanges) {
    if (this.user && !this.user.sellingItem) {
      this.itemService
        .getLatest(this.user.id)
        .subscribe((response: ItemDataResponse) => {
          this.user.sellingItem = response.data;
          this.user.sellingItemCount = response.count;
        });
    }
  }
}
