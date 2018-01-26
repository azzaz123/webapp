import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ItemService } from '../../../core/item/item.service';
import { Item } from 'shield';
import * as _ from 'lodash';
import { Order, Product, SelectedItemsAction } from '../../../core/item/item-response.interface';
import { OrderEvent, SelectedProduct } from './selected-product.interface';
import { Observable } from 'rxjs/Observable';
import { TrackingService } from "../../../core/tracking/tracking.service";

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
export class SelectedItemsComponent implements OnInit, OnDestroy {

  @HostBinding('@enterFromBottom') public animation: void;
  @Input() items: Item[];
  @Output() onAction: EventEmitter<OrderEvent> = new EventEmitter();
  public selectedItems: Item[];
  public selectedProducts: SelectedProduct[] = [];
  public total = 0;
  public loading: boolean;
  private getAvailableProductsObservable: Observable<Product>;
  private active = true;
  private selectedProductsIds: string[] = [];

  constructor(public itemService: ItemService,
              private trackingService: TrackingService) {
  }

  ngOnInit() {
    this.itemService.selectedItems$.takeWhile(() => {
      return this.active;
    }).subscribe((action: SelectedItemsAction) => {
      this.initSelectedItems(action);
    });
  }

  ngOnDestroy() {
    this.active = false;
  }

  private initSelectedItems(action: SelectedItemsAction) {
    if (action.action === 'selected' && this.selectedProductsIds.find((id: string) => {
        return id === action.id;
      })) {
      return;
    }
    this.selectedItems = this.itemService.selectedItems.map((id: string) => {
      return <Item>_.find(this.items, {id: id});
    });
    if (this.itemService.selectedAction === 'feature') {
      if (action.action === 'selected') {
        this.selectedProductsIds.push(action.id);
        this.getAvailableProductsObservable = this.itemService.getAvailableProducts(action.id).share();
        this.getAvailableProductsObservable.subscribe((product: Product) => {
          this.getAvailableProductsObservable = null;
          this.selectedProducts.push({
            itemId: action.id,
            product: product
          });
          this.calculateTotal();
        });
      } else if (action.action === 'deselected') {
        if (this.getAvailableProductsObservable) {
          this.getAvailableProductsObservable.subscribe(() => {
            this.deselect(action.id);
          });
        } else {
          this.deselect(action.id);
        }
        this.selectedProductsIds = _.without(this.selectedProductsIds, action.id);
      }
    }
  }

  private deselect(itemId: string) {
    const index: number = _.findIndex(this.selectedProducts, {itemId: itemId});
    if (index !== -1) {
      this.selectedProducts.splice(index, 1);
      this.calculateTotal();
    }
  }

  public featureItems() {
    const order: Order[] = this.selectedProducts.map((product: SelectedProduct) => {
      return {
        item_id: product.itemId,
        product_id: product.product.durations[0].id
      }
    });
    this.loading = true;
    this.onAction.emit({
      order: order,
      total: this.total
    });

    let result = order.map(purchase => ({ item_id: purchase.item_id, bump_type: purchase.product_id }));
    this.trackingService.track(TrackingService.CATALOG_FEATURED_CHECKOUT, { selected_products: result });
    gtag('event', 'conversion', {'send_to': 'AW-829909973/oGcOCL7803sQ1dfdiwM'});
    fbq('track', '176083133152402', {});
  }

  private calculateTotal() {
    this.total = _.sumBy(this.selectedProducts, (product: SelectedProduct) => {
      return product.product.durations ? +product.product.durations[0].market_code : 0;
    });
  }

}
