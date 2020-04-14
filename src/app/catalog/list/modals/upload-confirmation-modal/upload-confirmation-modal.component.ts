
import {share} from 'rxjs/operators';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { Order, Product } from '../../../../core/item/item-response.interface';
import { OrderEvent } from '../../selected-items/selected-product.interface';
import { Observable } from 'rxjs';
import { ItemService } from '../../../../core/item/item.service';
import { Item } from '../../../../core/item/item';
import { WindowRef } from '../../../../core/window/window.service';
import { PaymentService } from '../../../../core/payments/payment.service';
import { CreditInfo } from '../../../../core/payments/payment.interface';

@Component({
  selector: 'tsl-upload-confirmation-modal',
  templateUrl: './upload-confirmation-modal.component.html',
  styleUrls: ['./upload-confirmation-modal.component.scss']
})
export class UploadConfirmationModalComponent implements OnInit {

  public item: Item;
  public productPrice: number;
  public productId: string;
  private getUrgentProductsObservable: Observable<Product>;
  @Output() onAction: EventEmitter<OrderEvent> = new EventEmitter();
  public creditInfo: CreditInfo;


  constructor(public activeModal: NgbActiveModal,
              private window: WindowRef,
              private trackingService: TrackingService,
              private paymentService: PaymentService,
              public itemService: ItemService) {
  }

  ngOnInit() {
    ga('send', 'event', 'Item', 'upload');
    gtag('event', 'conversion', {'send_to': 'AW-829909973/7aOVCJvxvHsQ1dfdiwM'});
    twq('track', 'Purchase', {
      value: '0',
      currency: 'EUR',
      num_items: '0',
      content_type: 'product',
      content_name: 'Upload product from form'
    });
    this.paymentService.getCreditInfo().subscribe((creditInfo: CreditInfo) => {
      this.creditInfo = creditInfo;
    });
  }

  public facebookShare() {
    const url = 'https://www.facebook.com/dialog/share?app_id=258778180928082&display=popup&href=' + encodeURIComponent(this.item.webLink);
    this.window.nativeWindow.open(url, 'fbShareWindow', 'height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
  }

  public twitterShare() {
    const text = 'Mira que acabo de encontrar en @Wallapop:';
    const url = 'https://twitter.com/intent/tweet?' +
      'text=' + encodeURIComponent(text) +
      '&url=' + encodeURIComponent(this.item.webLink);
    this.window.nativeWindow.open(url, 'twShareWindow', 'height=269,width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
  }

  public featureUrgentItem(): void {
    const order: Order[] = [{
      item_id: this.item.id,
      product_id: this.productId
    }];
    const orderEvent: OrderEvent = {
      order: order,
      total: this.productPrice
    };
    localStorage.setItem('transactionType', 'urgent');
    this.activeModal.close(orderEvent);
  }

  public urgentPrice(): void {
    this.getUrgentProductsObservable = this.itemService.getUrgentProducts(this.item.id).pipe(share());
    this.getUrgentProductsObservable.subscribe((product: Product) => {
      this.getUrgentProductsObservable = null;
      this.productPrice = +product.durations[0].market_code;
      this.productId = product.durations[0].id;
    });
  }

  public trackUploaded(): void {
    this.trackingService.track(TrackingService.UPLOADFORM_SUCCESS, {categoryId: this.item.categoryId});
    fbq('track', 'AddToCart', {
      value: this.item.salePrice,
      currency: this.item.currencyCode,
      content_ids: this.item.id,
      content_type: this.item.categoryId,
    });

    pintrk('track', 'addtocart', {
      value: this.item.salePrice,
      currency: this.item.currencyCode,
      line_items: [
        {
          product_category: this.item.categoryId,
          product_id: this.item.id,
        }
      ]
    });
  }

}
