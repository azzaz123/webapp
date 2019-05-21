import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InboxUser } from '../../inbox-user';
import { UserService } from '../../../../../core/user/user.service';
import { UserInfoResponse } from '../../../../../core/user/user-info.interface';

@Component({
  selector: 'tsl-inbox-user-detail',
  templateUrl: './inbox-user-detail.component.html',
  styleUrls: ['./inbox-user-detail.component.scss']
})
export class InboxUserDetailComponent implements OnInit, OnChanges {

  @Input() user: InboxUser;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  ngOnChanges(changes?: SimpleChanges) {
    if (changes.user) {
      if (this.user.score === undefined || this.user.responseRate === undefined) {
        this.userService.getInfo(this.user.id).subscribe((info: UserInfoResponse) => {
          this.user.score = info.scoring_stars;
          this.user.responseRate = info.response_rate;
        });
      }
    }
  }

  public userDistance(): number {
    return this.userService.calculateDistanceFromItem(this.user, null);
  }
}
