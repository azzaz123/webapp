import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../../../../core/item/item.service';
import { ListingFeeProductInfo, Product, Order } from '../../../../core/item/item-response.interface';
import { OrderEvent } from '../../selected-items/selected-product.interface';

@Component({
  selector: 'tsl-upgrade-plan-modal',
  templateUrl: './upgrade-plan-modal.component.html',
  styleUrls: ['./upgrade-plan-modal.component.scss']
})
export class UpgradePlanModalComponent implements OnInit {

  public itemId: string;
  public listingFeePrice: number;
  public listingFeeProduct: Product;

  constructor(public activeModal: NgbActiveModal, private itemService: ItemService) {
  }

  ngOnInit() {
    this.itemService.getListingFeeInfo(this.itemId).subscribe((response: Product) => {
      this.listingFeeProduct = response;
      this.listingFeePrice = +response.durations[0].market_code;
    });
  }

  public purchaseListingFee(): void {
    const order: Order[] = [{
      item_id: this.itemId,
      product_id: this.listingFeeProduct.durations[0].id
    }];
    const orderEvent: OrderEvent = {
      order: order,
      total: this.listingFeePrice
    };
    localStorage.setItem('transactionType', 'purchaseListingFee');
    this.activeModal.close(orderEvent);
  }

}
