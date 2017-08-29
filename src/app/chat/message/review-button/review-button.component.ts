import { Component, Input, OnInit } from '@angular/core';
import { Message, Item, ConversationService, UserService, ReviewService } from 'shield';

@Component({
  selector: 'tsl-review-button',
  templateUrl: './review-button.component.html',
  styleUrls: ['./review-button.component.scss']
})
export class ReviewButtonComponent implements OnInit {

  @Input() message: Message;
  public showButton;

  constructor(private conversationService: ConversationService,
              private reviewService: ReviewService,
              private userService: UserService) {
  }

  ngOnInit() {
    const item: Item = this.conversationService.getItemFromConvId(this.message.conversationId);
    const storageKey: string = this.userService.user.id + '.item.' + item.id + '.reviewed';
    const alreadyReviewed: string = localStorage.getItem(storageKey);
    if (!alreadyReviewed) {
      this.reviewService.check(item.id).subscribe((reviewLeft: boolean) => {
        if (reviewLeft) {
          localStorage.setItem(storageKey, 'true');
        } else {
          this.showButton = true;
        }
      })
    }
  }

}
