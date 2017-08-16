import { Component, Input, OnChanges } from '@angular/core';
import { User } from 'shield';
import { UserService } from '../user.service';
import { UserInfoResponse } from '../user-info.interface';

@Component({
  selector: 'tsl-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnChanges {

  @Input() user: User;
  @Input() phone: string;

  constructor(private userService: UserService) {
  }

  ngOnChanges(changes?: any) {
    if (this.user.scoringStars === undefined || this.user.responseRate === undefined) {
      this.userService.getInfo(this.user.id).subscribe((info: UserInfoResponse) => {
        this.user.scoringStars = info.scoring_stars;
        this.user.responseRate = info.response_rate;
      });
    }
  }

}
