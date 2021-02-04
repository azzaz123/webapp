import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '@core/item/item';
import { SocialShareService } from '@core/social-share/social-share.service';

@Component({
  selector: 'tsl-bump-suggestion-modal',
  templateUrl: './bump-suggestion-modal.component.html',
  styleUrls: ['./bump-suggestion-modal.component.scss'],
})
export class BumpSuggestionModalComponent {
  public item: Item;
  public productPrice: number;
  public productCurrency: string;

  constructor(public activeModal: NgbActiveModal, private socialShareService: SocialShareService) {}

  public onFacebookShare(): void {
    this.socialShareService.facebookShare(this.item.webLink);
  }

  public onTwitterShare(): void {
    this.socialShareService.twitterShare(this.item.webLink);
  }
}
