import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '@core/item/item';

@Component({
  selector: 'tsl-bump-suggestion-modal',
  templateUrl: './bump-suggestion-modal.component.html',
  styleUrls: ['./bump-suggestion-modal.component.scss'],
})
export class BumpSuggestionModalComponent implements OnInit {
  public item: Item;
  public productPrice: number;
  public productCurrency: string;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  public facebookShare(): void {
    const url =
      'https://www.facebook.com/dialog/share?app_id=258778180928082&display=popup&href=' +
      encodeURIComponent(this.item.webLink);
    window.open(
      url,
      'fbShareWindow',
      'height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'
    );
  }

  public twitterShare(): void {
    const url =
      'https://twitter.com/intent/tweet?url=' +
      encodeURIComponent(this.item.webLink);
    window.open(
      url,
      'twShareWindow',
      'height=269,width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'
    );
  }
}
