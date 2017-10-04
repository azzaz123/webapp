import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../../../../core/item/item.service';
import { ConversationUser } from '../../../../core/item/item-response.interface';
import { Item, ReviewDataSeller, ReviewService } from 'shield';


@Component({
  selector: 'tsl-sold-modal',
  templateUrl: './sold-modal.component.html',
  styleUrls: ['./sold-modal.component.scss']
})
export class SoldModalComponent implements OnInit {

  public item: Item;
  public conversationUsers: ConversationUser[] = [];
  public selectedUser: ConversationUser;
  public score: number;
  public comments: string;
  public price: number;
  public thanks: boolean;

  constructor(public activeModal: NgbActiveModal,
              private itemService: ItemService,
              private reviewService: ReviewService) {
  }

  ngOnInit() {
    this.price = this.item.salePrice;
    this.itemService.getConversationUsers(this.item.id).subscribe((conversationUsers: ConversationUser[]) => {
      this.conversationUsers = conversationUsers;
    });
  }

  public chooseUser(user: ConversationUser) {
    this.selectedUser = user;
  }

  public onRated(score: number) {
    this.score = score;
  }

  public setSoldOutside() {
    this.itemService.soldOutside(this.item.id).subscribe(() => this.activeModal.close());
  }

  public setSold() {
    const data: ReviewDataSeller = {
      to_user_id: this.selectedUser.id,
      item_id: this.item.id,
      comments: this.comments,
      score: this.score * 20,
      price: this.price
    };
    this.reviewService.createAsSeller(data).subscribe(() => this.thanks = true);
  }

}
