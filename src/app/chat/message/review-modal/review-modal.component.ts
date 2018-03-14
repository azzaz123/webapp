import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../core/user/user.service';
import { ReviewModalResult } from './review-modal-result.interface';
import { Item } from '../../../core/item/item';
import { User } from '../../../core/user/user';

@Component({
  selector: 'tsl-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss']
})
export class ReviewModalComponent implements OnInit {

  @Input() item: Item;
  public user: User;
  public score: number;
  public comments: string;

  constructor(public activeModal: NgbActiveModal,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.get(this.item.owner).subscribe((user: User) => {
      this.user = user;
    });
  }

  public close() {
    const result: ReviewModalResult = {
      score: this.score,
      comments: this.comments,
      userId: this.user.id
    };
    this.activeModal.close(result);
  }

  public onRated(score: number) {
    this.score = score;
  }

}
