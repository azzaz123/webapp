import { Component, Input, OnInit } from '@angular/core';
import { Message, Item, User } from 'shield';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../core/user/user.service';

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
    this.activeModal.close({
      score: this.score,
      comments: this.comments,
      userId: this.user.id
    });
  }

  public onRated(score: number) {
    this.score = score;
  }

}
