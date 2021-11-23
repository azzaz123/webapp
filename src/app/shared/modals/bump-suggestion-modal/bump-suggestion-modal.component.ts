import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '@core/item/item';
import { SocialShareService } from '@core/social-share/social-share.service';
import { ItemDetailRoutePipe } from '@shared/pipes';

@Component({
  selector: 'tsl-bump-suggestion-modal',
  templateUrl: './bump-suggestion-modal.component.html',
  styleUrls: ['./bump-suggestion-modal.component.scss'],
})
export class BumpSuggestionModalComponent {
  public item: Item;
  public productPrice: number;
  public productCurrency: string;

  constructor(
    public activeModal: NgbActiveModal,
    private socialShareService: SocialShareService,
    private itemDetailRoutePipe: ItemDetailRoutePipe
  ) {}

  public onFacebookShare(): void {
    this.socialShareService.facebookShare(this.itemLink);
  }

  public onTwitterShare(): void {
    this.socialShareService.twitterShare(this.itemLink);
  }

  get itemLink(): string {
    return this.itemDetailRoutePipe.transform(this.item?.webSlug);
  }
}
