import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '@core/payments/payment.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { Item } from '@core/item/item';
import { CheapestProducts } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';

@Component({
  selector: 'tsl-bump-suggestion-modal',
  templateUrl: './bump-suggestion-modal.component.html',
  styleUrls: ['./bump-suggestion-modal.component.scss'],
})
export class BumpSuggestionModalComponent implements OnInit {
  public item: Item;
  public itemId: string;
  public productPrice: number;
  public productId: string;
  public creditInfo: CreditInfo;

  constructor(
    public activeModal: NgbActiveModal,
    private itemService: ItemService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.getCheapestProductPrice();
    this.getCreditInfo();
  }

  private getCheapestProductPrice() {
    this.itemService
      .getCheapestProductPrice([this.itemId])
      .subscribe((value: CheapestProducts) => {
        this.productPrice = +value[this.itemId];
      });
  }

  private getCreditInfo() {
    this.paymentService
      .getCreditInfo(false)
      .subscribe((creditInfo: CreditInfo) => {
        this.creditInfo = creditInfo;
      });
  }

  public facebookShare() {
    console.log('fb', this.item);
    const url =
      'https://www.facebook.com/dialog/share?app_id=258778180928082&display=popup&href=' +
      encodeURIComponent(this.item.webLink);
    window.open(
      url,
      'fbShareWindow',
      'height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'
    );
  }

  public twitterShare() {
    const text = 'Mira que acabo de encontrar en @Wallapop:';
    const url =
      'https://twitter.com/intent/tweet?' +
      'text=' +
      encodeURIComponent(text) +
      '&url=' +
      encodeURIComponent(this.item.webLink);
    window.open(
      url,
      'twShareWindow',
      'height=269,width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'
    );
  }
}
