import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SubscriptionSlot } from '@api/core/model/subscriptions/slots/subscription-slot.interface';
import { Item } from '@core/item/item';
import { ItemService } from '@core/item/item.service';
import { PERMISSIONS } from '@core/user/user-constants';
import { BUMPS_PATHS } from '@private/features/bumps/bumps-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { Subscription } from 'rxjs';
import { STATUS } from './selected-product.interface';
import { CatalogItemTrackingEventService } from '@private/features/catalog/core/services/catalog-item-tracking-event.service';

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
  public readonly BUMP_PATH = `/${PRIVATE_PATHS.BUMPS}/${BUMPS_PATHS.CHECKOUT}`;
  private selectedItemsSubscription: Subscription;

  constructor(public itemService: ItemService, private catalogItemTrackingEventService: CatalogItemTrackingEventService) {}

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

  public trackClickBumpItems(): void {
    this.catalogItemTrackingEventService.trackClickBumpItems(this.selectedItems.length);
  }

  public onClickAction(action: string) {
    this.selectedAction.emit(action);
  }

  ngOnDestroy() {
    if (this.selectedItemsSubscription) {
      this.selectedItemsSubscription.unsubscribe();
    }
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
}
