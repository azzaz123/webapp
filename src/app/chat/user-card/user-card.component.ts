import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { User } from '../../core/user/user';
import { ItemService } from '../../core/item/item.service';
import { ItemDataResponse } from '../../core/item/item-response.interface';

@Component({
  selector: 'tsl-user',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnChanges {

  @Input() user: User;
  @Input() phone: string;

  constructor(private itemService: ItemService) {
  }

  ngOnChanges(changes?: any) {
    if (!this.user.sellingItem) {
      this.itemService.getLatest(this.user.id).subscribe((res: ItemDataResponse) => {
        this.user.sellingItem = res.data;
        this.user.itemsCount = res.count;
      });
    }
  }

}
