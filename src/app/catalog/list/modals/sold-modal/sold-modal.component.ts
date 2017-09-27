import { Component, OnInit } from '@angular/core';
import { Item } from 'shield';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../../../../core/item/item.service';
import { ConversationUser } from '../../../../core/item/item-response.interface';

@Component({
  selector: 'tsl-sold-modal',
  templateUrl: './sold-modal.component.html',
  styleUrls: ['./sold-modal.component.scss']
})
export class SoldModalComponent implements OnInit {

  public item: Item;
  public conversationUsers: ConversationUser[];

  constructor(public activeModal: NgbActiveModal,
              private itemService: ItemService) {
  }

  ngOnInit() {
    this.itemService.getConversationUsers(this.item.id).subscribe((conversationUsers: ConversationUser[]) => {
      this.conversationUsers = conversationUsers;
    });
  }

}
