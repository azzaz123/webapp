import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';

import { Item } from '../../../core/item/item';
import { ItemService } from '../../../core/item/item.service';
import { SelectedItemsAction } from '../../../core/item/item-response.interface';

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

  constructor(public itemService: ItemService) {
  }

  ngOnInit() {
    this.itemService.selectedItems$.subscribe(() => {
      this.selectedItems = this.itemService.selectedItems.map(id => this.items.find(item => item.id === id));
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

}
