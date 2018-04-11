import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../../../core/item/item.service';
import { ConversationUser } from '../../../core/item/item-response.interface';
import { Item } from '../../../core/item/item';

@Component({
  selector: 'tsl-sold-modal',
  templateUrl: './sold-modal.component.html',
  styleUrls: ['./sold-modal.component.scss']
})
export class SoldModalComponent implements OnInit {

  public item: Item;
  public conversationUsers: ConversationUser[] = [];
  public buyer: ConversationUser;
  public price: number;
  public thanks = false;

  constructor(public activeModal: NgbActiveModal,
              private itemService: ItemService) {
  }

  ngOnInit() {
    this.price = this.item.salePrice;
    this.itemService.getConversationUsers(this.item.id).subscribe((conversationUsers: ConversationUser[]) => {
      this.conversationUsers = conversationUsers;
    });
  }

  public onFinishedReview() {
    this.thanks = true;
  }

  public chooseUser(user: ConversationUser) {
    this.buyer = user;
  }

  public setSoldOutside() {
    this.itemService.soldOutside(this.item.id).subscribe(() => this.activeModal.close());
  }
}
