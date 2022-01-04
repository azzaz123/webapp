import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from '@angular/core';
import { User } from '../../../core/user/user';
import { ConversationUser } from '../../../core/item/item-response.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReviewDataSeller, ReviewDataBuyer } from '../../../core/review/review.interface';
import { Item } from '../../../core/item/item';
import { ReviewService } from '../../../core/review/review.service';

@Component({
  selector: 'tsl-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss'],
})
export class ReviewModalComponent implements OnInit, OnChanges {
  @Input() userToReview: ConversationUser;
  @Input() item: Item;
  @Input() isSeller?: boolean;
  @Input() canChooseBuyer: boolean;
  @Input() thread?: string;
  @Output() finishedReview = new EventEmitter();
  @Output() backPress = new EventEmitter();
  public seller: User;
  public userName: string;
  public score: number;
  public comments: string;
  public price: number;
  public reviewCommentLength = 0;

  constructor(public activeModal: NgbActiveModal, private reviewService: ReviewService) {}

  public countChars(event) {
    this.reviewCommentLength = event.target.value.length;
  }

  public sumbitReview() {
    if (this.isSeller) {
      const data: ReviewDataSeller = {
        to_user_id: this.userToReview.id,
        item_id: this.item.id,
        comments: this.comments,
        score: this.score * 20,
        price: this.price,
      };
      this.reviewService.createAsSeller(data).subscribe(() => {
        this.finishedReview.emit(null);
      });
    } else {
      const data: ReviewDataBuyer = {
        to_user_id: this.userToReview.id,
        item_id: this.item.id,
        comments: this.comments,
        score: this.score * 20,
        conversation_id: this.thread,
      };
      this.reviewService.createAsBuyer(data).subscribe((r) => this.activeModal.close(r));
    }
  }

  public onRated(score: number) {
    this.score = score;
  }

  ngOnInit() {
    this.setUsername();
    this.price = this.item.salePrice;
  }

  ngOnChanges() {
    this.setUsername();
  }

  private setUsername() {
    if (this.userToReview) {
      this.userName = this.userToReview.micro_name;
    }
  }
}
