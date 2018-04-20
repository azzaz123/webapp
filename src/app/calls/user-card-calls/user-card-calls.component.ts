import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { User } from '../../core/user/user';
import { UserService } from '../../core/user/user.service';
import { UserInfoResponse } from '../../core/user/user-info.interface';

@Component({
  selector: 'tsl-user-card-calls',
  templateUrl: './user-card-calls.component.html',
  styleUrls: ['./user-card-calls.component.scss']
})
export class UserCardCallsComponent implements OnChanges {

  @Input() user: User;

  constructor(private userService: UserService) { }

  ngOnChanges(changes?: any) {
    if (changes.user) {
      if (this.user.scoringStars === undefined || this.user.responseRate === undefined) {
        this.userService.getInfo(this.user.id).subscribe((info: UserInfoResponse) => {
          this.user.scoringStars = info.scoring_stars;
          this.user.responseRate = info.response_rate;
        });
      }
    }
  }

}
