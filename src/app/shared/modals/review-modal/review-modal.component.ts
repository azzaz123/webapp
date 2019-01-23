import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from '@angular/core';
import { User } from '../../../core/user/user';
import { ConversationUser } from '../../../core/item/item-response.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReviewDataSeller } from '../../../core/review/review.interface';
import { Item } from '../../../core/item/item';
import { ReviewService } from '../../../core/review/review.service';
import { UserService } from '../../../core/user/user.service';
import { ReviewModalResult } from './review-modal-result.interface';

@Component({
  selector: 'tsl-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss']
})
export class ReviewModalComponent implements OnInit, OnChanges {

  @Input() userToReview: ConversationUser;
  @Input() item: Item;
  @Input() isSeller?: boolean;
  @Output() finishedReview = new EventEmitter();
  @Output() backPress = new EventEmitter();

  public seller: User;
  public userName: string;
  public score: number;
  public comments: string;
  public price: number;
  public reviewCommentLength = 0;

  constructor(public activeModal: NgbActiveModal,
              private reviewService: ReviewService,
              private userService: UserService) { }


  ngOnInit() {
    if (!this.isSeller) {
      this.userService.get(this.item.owner).subscribe((user: User) => {
        this.seller = user;
        this.userName = this.seller.microName;
      });
    }

  ngOnChanges() {
    this.setUsername();
  }

  private setUsername() {
    if (this.userToReview) {
      this.userName = this.userToReview.micro_name;
     }
  }

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
        price: this.price
      };
      this.reviewService.createAsSeller(data).subscribe(() => {
        this.finishedReview.emit(null);
      });
    } else {
      const result: ReviewModalResult = {
        score: this.score,
        comments: this.comments,
        userId: this.seller.id
      };
      this.activeModal.close(result);
    }
  }

  public onRated(score: number) {
    this.score = score;
  }

}
