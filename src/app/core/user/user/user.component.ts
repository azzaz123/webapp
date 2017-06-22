import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { User } from '../user';
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
  private active: boolean = true;

  constructor(private itemService: ItemService) {
  }

  ngOnChanges(changes?: any) {
    if (!this.user.sellingItem && !this.callsPanel) {
      this.itemService.getLatest(this.user.id).takeWhile(() => {
        return this.active;
      }).subscribe((res: ItemDataResponse) => {
        this.user.sellingItem = res.data;
        this.user.itemsCount = res.count;
      });
    }
  }

  ngOnDestroy() {
    this.active = false;
  }

}
