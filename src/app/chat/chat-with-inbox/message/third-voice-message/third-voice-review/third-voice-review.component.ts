import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConversationService } from '../../../../../core/conversation/conversation.service';
import { ReviewService } from '../../../../../core/review/review.service';
import { UserService } from '../../../../../core/user/user.service';
import { ReviewModalComponent } from '../../../../../shared/modals/review-modal/review-modal.component';
import { SoldModalComponent } from '../../../../../shared/modals/sold-modal/sold-modal.component';
import { ConversationUser } from '../../../../../core/item/item-response.interface';
import { InboxItem, InboxUser } from '../../../inbox';
import { InboxMessage } from '../../inbox-message';

@Component({
  selector: 'tsl-third-voice-button',
  templateUrl: './third-voice-review.component.html',
  styleUrls: ['./third-voice-review.component.scss']
})
export class ThirdVoiceReviewComponent implements OnInit {

  @Input() message: InboxMessage;
  @Input() user: InboxUser;
  @Input() item: InboxItem;

  public showButton: boolean;

  constructor(private conversationService: ConversationService,
              private reviewService: ReviewService,
              private userService: UserService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    const alreadyReviewed: string = localStorage.getItem(this.getStorageKey());
    if (!alreadyReviewed) {
      this.reviewService.check(this.item.id).subscribe((isReviewed: boolean) => {
        if (isReviewed) {
          localStorage.setItem(this.getStorageKey(), 'true');
          this.showButton = false;
        } else {
          this.showButton = true;
        }
      });
    } else {
      this.showButton = false;
    }
  }

  private buildConversationUser(): ConversationUser {
    return {
      id: this.user.id,
      micro_name: this.user.microName
    } as ConversationUser;
  }

  public openDialog() {
    this.item.isMine ? this.reviewAsSeller() : this.reviewAsBuyer();
  }

  private getStorageKey(): string {
    return `${this.user.id}.item.${this.item.id}.reviewed`;
  }

  private reviewSent() {
    this.showButton = false;
    localStorage.setItem(this.getStorageKey(), 'true');
  }

  private reviewAsBuyer() {
    const modalRef: NgbModalRef = this.modalService.open(ReviewModalComponent, { windowClass: 'review' });
    modalRef.componentInstance.item = this.item;
    modalRef.componentInstance.userToReview = this.buildConversationUser();
    modalRef.componentInstance.thread = this.message.thread;
    modalRef.result.then(() => this.reviewSent(), () => {
    });
  }

  private reviewAsSeller() {
    const modalRef: NgbModalRef = this.modalService.open(SoldModalComponent, { windowClass: 'review' });
    modalRef.componentInstance.item = this.item;
    modalRef.componentInstance.userToReview = this.buildConversationUser();
    modalRef.componentInstance.isSeller = this.item.isMine;
    modalRef.componentInstance.canChooseBuyer = false;
    modalRef.result.then(() => this.showButton = false, () => {
    });
  }
}
