import { Component, Input, OnInit } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ReviewService } from '../../../../../core/review/review.service';
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

  public showButton = true;

  constructor(private reviewService: ReviewService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.showButton = true;
    const localReview: string = localStorage.getItem(this.getStorageKey());
    if (!localReview) {
      this.reviewService.check(this.item.id).subscribe((globalReview: boolean) => {
        if (globalReview) {
          this.setItemAsReviewed();
        }
      });
    } else {
      this.showButton = false;
    }
  }

  public openDialog(): void {
    this.item.isMine ? this.reviewAsSeller() : this.reviewAsBuyer();
  }

  private buildConversationUser(): ConversationUser {
    return {
      id: this.user.id,
      micro_name: this.user.microName
    } as ConversationUser;
  }

  private getStorageKey(): string {
    return `${this.user.id}.item.${this.item.id}.reviewed`;
  }

  private setItemAsReviewed() {
    this.showButton = false;
    localStorage.setItem(this.getStorageKey(), 'true');
  }

  private reviewAsBuyer() {
    const modalRef: NgbModalRef = this.modalService.open(ReviewModalComponent, { windowClass: 'review' });
    modalRef.componentInstance.item = this.item;
    modalRef.componentInstance.userToReview = this.buildConversationUser();
    modalRef.componentInstance.thread = this.message.thread;
    modalRef.result.then(() => this.setItemAsReviewed(), () => {
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
