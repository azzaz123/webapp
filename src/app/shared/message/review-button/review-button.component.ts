import { last } from 'lodash';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ReviewModalComponent } from '../../../shared/modals/review-modal/review-modal.component';
import { Message } from '../../../core/message/message';
import { Item } from '../../../core/item/item';
import { ConversationService } from '../../../core/conversation/conversation.service';
import { UserService } from '../../../core/user/user.service';
import { ReviewService } from '../../../core/review/review.service';
import { SoldModalComponent } from '../../modals/sold-modal/sold-modal.component';
import { ConversationUser } from '../../../core/item/item-response.interface';

@Component({
  selector: 'tsl-review-button',
  templateUrl: './review-button.component.html',
  styleUrls: ['./review-button.component.scss']
})
export class ReviewButtonComponent implements OnInit {

  @Input() message: Message;
  @Output() finishedReview = new EventEmitter();
  public showButton: boolean;
  private item: Item;
  private storageKey: string;
  private conversationUser: ConversationUser;
  private isSeller: boolean;

  constructor(private conversationService: ConversationService,
              private reviewService: ReviewService,
              private userService: UserService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.item = this.conversationService.getItemFromThread(this.message.thread);
    this.conversationService.get(this.message.thread).subscribe((conv) => {
      this.conversationUser = {
        id: conv.user.id,
        micro_name: conv.user.microName,
        last_message: last(conv.messages.filter(msg => msg.from === conv.user.id)),
        image: conv.user.image
      };
      this.isSeller = this.item.owner !== this.conversationUser.id;
    });
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
      });
    } else {
      this.showButton = false;
    }
  }

  public openDialog() {
    this.isSeller ? this.reviewAsSeller() : this.reviewAsBuyer();
  }

  private reviewSent() {
    this.showButton = false;
    localStorage.setItem(this.storageKey, 'true');
  }

  private reviewAsBuyer() {
    const modalRef: NgbModalRef = this.modalService.open(ReviewModalComponent, {windowClass: 'review'});
    modalRef.componentInstance.item = this.item;
    modalRef.componentInstance.userToReview = this.conversationUser;
    modalRef.componentInstance.thread = this.message.thread;
    modalRef.result.then(() => this.reviewSent(), () => {});
  }

  private reviewAsSeller() {
    const modalRef: NgbModalRef = this.modalService.open(SoldModalComponent, {windowClass: 'review'});
    modalRef.componentInstance.item = this.item;
    modalRef.componentInstance.userToReview = this.conversationUser;
    modalRef.componentInstance.isSeller = this.isSeller;
    modalRef.componentInstance.canChooseBuyer = false;
    modalRef.result.then(() => this.showButton = false, () => {});
  }

}
