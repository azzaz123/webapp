import { Component, OnInit } from '@angular/core';
import { Item } from 'shield';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../../../../core/item/item.service';
import { ConversationUser } from '../../../../core/item/item-response.interface';
import { ReviewModalResult } from '../../../../chat/message/review-modal/review-modal-result.interface';

@Component({
  selector: 'tsl-sold-modal',
  templateUrl: './sold-modal.component.html',
  styleUrls: ['./sold-modal.component.scss']
})
export class SoldModalComponent implements OnInit {

  public item: Item;
  public conversationUsers: ConversationUser[];
  public selectedUser: ConversationUser;
  public score: number;
  public comments: string;
  public price: number;

  constructor(public activeModal: NgbActiveModal,
              private itemService: ItemService) {
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

  public close() {
    const result: ReviewModalResult = {
      score: this.score,
      comments: this.comments,
      userId: this.selectedUser.id,
      price: this.price
    };
    this.activeModal.close(result);
  }

  public onRated(score: number) {
    this.score = score;
  }

}
