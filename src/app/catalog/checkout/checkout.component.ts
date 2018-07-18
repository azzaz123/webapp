import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { ItemWithProducts } from '../../core/item/item-response.interface';
import { Router } from '@angular/router';
import { BumpTutorialComponent } from './bump-tutorial/bump-tutorial.component';
import { CreditInfo } from '../../core/payments/payment.interface';
import { PaymentService } from '../../core/payments/payment.service';

@Component({
  selector: 'tsl-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  itemsWithProducts: ItemWithProducts[];
  provincialBump: boolean;
  creditInfo: CreditInfo;
  @ViewChild(BumpTutorialComponent) bumpTutorial: BumpTutorialComponent;

  constructor(private itemService: ItemService,
              private router: Router,
              private paymentService: PaymentService) {
  }

  ngOnInit() {
    if (!this.itemService.selectedItems.length) {
      this.router.navigate(['catalog/list']);
      return;
    }
    this.itemService.getItemsWithAvailableProducts(this.itemService.selectedItems).subscribe((itemsWithProducts: ItemWithProducts[]) => {
      this.itemsWithProducts = itemsWithProducts;
      this.provincialBump = !this.itemsWithProducts[0].products['168'].citybump;
    });
    this.paymentService.getCreditInfo().subscribe((creditInfo: CreditInfo) => {
      this.creditInfo = creditInfo;
    });
  }

}
