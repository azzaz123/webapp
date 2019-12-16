import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from '../../../core/item/item';
import { ItemService } from '../../../core/item/item.service';
import { SubscriptionSlot } from '../../../core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-selected-items',
  templateUrl: './selected-items.component.html',
  styleUrls: ['./selected-items.component.scss']
})
export class SelectedItemsComponent implements OnInit {

  @Input() items: Item[] = [];
  @Input() selectedSubscriptionSlot: SubscriptionSlot;
  @Input() selectedStatus: string;
  @Input() isStripe = false;
  @Output() selectedAction: EventEmitter<string> = new EventEmitter();

  public selectedItems: Item[];
  public disableFeatureOption: boolean;

  constructor(public itemService: ItemService) {
  }

  ngOnInit() {
    this.itemService.selectedItems$.subscribe(() => {
      this.selectedItems = this.itemService.selectedItems.map(id => this.items.find(item => item.id === id));
      this.disableFeatureOption = !!this.isItemDisabled(this.selectedItems).length;
    });
  }

  public deselect() {
    this.itemService.deselectItems();
    this.items.map(item => item.selected = false);
    this.itemService.selectedAction = null;
    this.selectedItems = [];
  }

  public onClickAction(action: string) {
    this.selectedAction.emit(action);
  }

  private isItemDisabled(items: Item[]) {
    return items.filter(item => item.flags.onhold || item.flags.expired);
  }

}
