import { Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ItemService } from '../../../core/item/item.service';
import { Item } from 'shield';
import * as _ from 'lodash';
import { Order, Product, SelectedItemsAction } from '../../../core/item/item-response.interface';
import { SelectedProduct } from './selected-product.interface';

@Component({
  selector: 'tsl-selected-items',
  templateUrl: './selected-items.component.html',
  styleUrls: ['./selected-items.component.scss'],
  animations: [
    trigger('enterFromBottom', [
      transition(':enter', [
        style({transform: 'translateY(100%)'}),
        animate('300ms', style({transform: 'translateY(0)'}))
      ]),
      transition(':leave', [
        style({transform: 'translateY(0%)'}),
        animate('300ms', style({transform: 'translateY(100%)'}))
      ])
    ])
  ]
})
export class SelectedItemsComponent implements OnInit {

  @HostBinding('@enterFromBottom') public animation: void;
  @Input() items: Item[];
  @Output() onAction: EventEmitter<Order[]> = new EventEmitter();
  public selectedItems: Item[];
  public selectedProducts: SelectedProduct[] = [];
  public total = 0;

  constructor(public itemService: ItemService) {
  }

  ngOnInit() {
    this.itemService.selectedItems$.subscribe((action: SelectedItemsAction) => {
      this.selectedItems = this.itemService.selectedItems.map((id: string) => {
        return <Item>_.find(this.items, {id: id});
      });
      if (this.itemService.selectedAction === 'feature') {
        if (action.action === 'selected') {
          this.itemService.getAvailableProducts(action.id).subscribe((product: Product) => {
            this.selectedProducts.push({
              itemId: action.id,
              product: product
            });
            this.calculateTotal();
          });
        } else if (action.action === 'deselected') {
          const index: number = _.findIndex(this.selectedProducts, {itemId: action.id});
          if (index !== -1) {
            this.selectedProducts.splice(index, 1);
            this.calculateTotal();
          }
        }
      }
    });
  }

  public featureItems() {
    const order: Order[] = this.selectedProducts.map((product: SelectedProduct) => {
      return {
        item_id: product.itemId,
        product_id: product.product.durations[0].id
      }
    });
    this.onAction.emit(order);
  }

  private calculateTotal() {
    this.total = _.sumBy(this.selectedProducts, (product: SelectedProduct) => {
      return +product.product.durations[0].market_code;
    });
  }

}
