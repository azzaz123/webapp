import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { User } from 'shield';
import { ItemService, ItemDataResponse } from 'shield';

@Component({
  selector: 'tsl-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnChanges, OnDestroy {

  @Input() user: User;
  @Input() phone: string;
  @Input() callsPanel: boolean;
  private active = true;

  constructor(private itemService: ItemService) {
  }

  ngOnChanges(changes?: any) {
    if (!this.user.sellingItem && !this.callsPanel) {
      this.itemService.getLatest(this.user.id).takeWhile(() => {
        return this.active;
      }).subscribe((res: ItemDataResponse) => {
        this.user.sellingItem = res.data;
        // this.user.sellingItem = new Item(res.data.id, res.data.legacyId, res.data.owner, res.data.title,
        //   res.data.description, res.data.categoryId, res.data.location, res.data.salePrice, res.data.currencyCode,
        //   res.data.modifiedDate, res.data.url, res.data.flags, res.data.actionsAllowed, res.data.saleConditions,
        //   res.data.mainImage, res.data.images, res.data.webLink );
        this.user.itemsCount = res.count;
      });
    }
  }

  ngOnDestroy() {
    this.active = false;
  }

}
