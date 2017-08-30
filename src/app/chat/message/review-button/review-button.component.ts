import { Component, Input, OnInit } from '@angular/core';
import { Message, Item, ConversationService, UserService, ReviewService, ReviewData } from 'shield';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ReviewModalComponent } from '../review-modal/review-modal.component';

@Component({
  selector: 'tsl-review-button',
  templateUrl: './review-button.component.html',
  styleUrls: ['./review-button.component.scss']
})
export class ReviewButtonComponent implements OnInit {

  @Input() message: Message;
  public showButton;
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
        } else {
          this.showButton = true;
        }
      })
    }
  }

  public openDialog() {
    const modalRef: NgbModalRef = this.modalService.open(ReviewModalComponent, {windowClass: 'review'});
    modalRef.componentInstance.item = this.item;
    modalRef.result.then((result: any) => {
      const data: ReviewData = {
        price: this.item.salePrice,
        conversationHashId: this.message.conversationId,
        toUserId: result.userId,
        itemId: this.item.id,
        comments: result.comments,
        score: result.score,
        isPaymentPlatformReview: false
      };
      this.reviewService.create(data).subscribe(() => this.reviewSent());
    }, () => {
    });
  }

  public reviewSent() {
    this.showButton = false;
    localStorage.setItem(this.storageKey, 'true');
  }

}
