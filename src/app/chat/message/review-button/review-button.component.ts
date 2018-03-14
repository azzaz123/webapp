import { Component, Input, OnInit } from '@angular/core';
import { ReviewService, ReviewDataBuyer } from 'shield';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ReviewModalComponent } from '../review-modal/review-modal.component';
import { ReviewModalResult } from '../review-modal/review-modal-result.interface';
import { Message } from '../../../core/message/message';
import { Item } from '../../../core/item/item';
import { ConversationService } from '../../../core/conversation/conversation.service';
import { UserService } from '../../../core/user/user.service';

@Component({
  selector: 'tsl-review-button',
  templateUrl: './review-button.component.html',
  styleUrls: ['./review-button.component.scss']
})
export class ReviewButtonComponent implements OnInit {

  @Input() message: Message;
  public showButton: boolean;
  private item: Item;
  private storageKey: string;

  constructor(private conversationService: ConversationService,
              private reviewService: ReviewService,
              private userService: UserService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.item = this.conversationService.getItemFromConvId(this.message.conversationId);
    this.storageKey = this.userService.user.id + '.item.' + this.item.id + '.reviewed';
    const alreadyReviewed: string = localStorage.getItem(this.storageKey);
    if (!alreadyReviewed) {
      this.reviewService.check(this.item.id).subscribe((reviewLeft: boolean) => {
        if (reviewLeft) {
          localStorage.setItem(this.storageKey, 'true');
          this.showButton = false;
        } else {
          this.showButton = true;
        }
      })
    } else {
      this.showButton = false;
    }
  }

  public openDialog() {
    const modalRef: NgbModalRef = this.modalService.open(ReviewModalComponent, {windowClass: 'review'});
    modalRef.componentInstance.item = this.item;
    modalRef.result.then((result: ReviewModalResult) => {
      const data: ReviewDataBuyer = {
        conversation_id: this.message.conversationId,
        to_user_id: result.userId,
        item_id: this.item.id,
        comments: result.comments,
        score: result.score * 20
      };
      this.reviewService.createAsBuyer(data).subscribe(() => this.reviewSent());
    }, () => {
    });
  }

  private reviewSent() {
    this.showButton = false;
    localStorage.setItem(this.storageKey, 'true');
  }

}
