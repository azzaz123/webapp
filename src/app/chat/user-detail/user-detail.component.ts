import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { UserInfoResponse } from '../../core/user/user-info.interface';
import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user';

@Component({
  selector: 'tsl-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit, OnChanges {
  @Input() user: User;

  constructor(private userService: UserService) {}

  ngOnInit() {}

  ngOnChanges(changes?: SimpleChanges) {
    if (changes.user) {
      if (
        this.user.scoringStars === undefined ||
        this.user.responseRate === undefined
      ) {
        this.userService
          .getInfo(this.user.id)
          .subscribe((info: UserInfoResponse) => {
            this.user.scoringStars = info.scoring_stars;
            this.user.responseRate = info.response_rate;
          });
      }
    }
  }
}
