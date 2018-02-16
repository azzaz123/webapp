import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { ItemWithProducts } from '../../core/item/item-response.interface';

@Component({
  selector: 'tsl-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  itemsWithProducts: ItemWithProducts[];

  constructor(private itemService: ItemService) {
  }

  ngOnInit() {
    this.itemService.getItemsWithAvailableProducts(this.itemService.selectedItems).subscribe((itemsWithProducts: ItemWithProducts[]) => {
      this.itemsWithProducts = itemsWithProducts;
      console.log(this.itemsWithProducts);
    });
  }

  /*public featureItems() {
    const order: Order[] = this.selectedProducts.map((product: SelectedProduct) => {
      return {
        item_id: product.itemId,
        product_id: product.product.durations[0].id
      }
    });

    let result = order.map(purchase => ({ item_id: purchase.item_id, bump_type: purchase.product_id }));
    this.trackingService.track(TrackingService.CATALOG_FEATURED_CHECKOUT, { selected_products: result });
    ga('send', 'event', 'Item', 'bump-cart');
    gtag('event', 'conversion', {'send_to': 'AW-829909973/oGcOCL7803sQ1dfdiwM'});
    fbq('track', '176083133152402', {});
  }*/

}
