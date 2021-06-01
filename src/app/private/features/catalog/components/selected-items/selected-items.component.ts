import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Item } from '@core/item/item';
import { ItemService } from '@core/item/item.service';
import { SubscriptionSlot } from '@core/subscriptions/subscriptions.interface';
import { PERMISSIONS } from '@core/user/user-constants';
import { Subscription } from 'rxjs';
import { STATUS } from './selected-product.interface';

@Component({
  selector: 'tsl-selected-items',
  templateUrl: './selected-items.component.html',
  styleUrls: ['./selected-items.component.scss'],
})
export class SelectedItemsComponent implements OnInit, OnDestroy {
  @Input() items: Item[] = [];
  @Input() selectedSubscriptionSlot: SubscriptionSlot;
  @Input() selectedStatus: STATUS;
  @Output() selectedAction: EventEmitter<string> = new EventEmitter();

  public STATUS = STATUS;
  public selectedItems: Item[];
  public disableFeatureOption: boolean;
  public showActiveOption: boolean;
  public readonly PERMISSIONS = PERMISSIONS;
  private selectedItemsSubscription: Subscription;

  constructor(public itemService: ItemService) {}

  ngOnInit() {
    this.selectedItemsSubscription = this.itemService.selectedItems$.subscribe(() => {
      this.selectedItems = this.itemService.selectedItems.map((id) => this.items.find((item) => item.id === id));
      this.disableFeatureOption = !!this.isItemDisabled(this.selectedItems).length;
      this.showActiveOption = this.selectedItems.length && this.selectedItems.every((item) => item.flags.onhold);
    });
  }

  public deselect() {
    this.itemService.deselectItems();
    this.items.map((item) => (item.selected = false));
    this.itemService.selectedAction = null;
    this.selectedItems = [];
  }

  public onClickAction(action: string) {
    this.selectedAction.emit(action);
  }

  private isItemDisabled(items: Item[]) {
    return items.filter((item) => item.flags.onhold || item.flags.expired);
  }

  get hideFeaturedButton(): boolean {
    return this.selectedStatus === STATUS.INACTIVE || this.selectedStatus === STATUS.SOLD || this.disableFeatureOption;
  }

  get showActiveButton(): boolean {
    return this.selectedStatus === STATUS.INACTIVE || (this.selectedStatus === STATUS.PUBLISHED && this.showActiveOption);
  }

  ngOnDestroy() {
    if (this.selectedItemsSubscription) {
      this.selectedItemsSubscription.unsubscribe();
    }
  }
}
