import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InboxUser } from '../../../model/inbox-user';
import { UserService } from '../../../../core/user/user.service';
import { UserInfoResponse } from '../../../../core/user/user-info.interface';
import { InboxItem } from '../../../model/inbox-item';

@Component({
  selector: 'tsl-inbox-user-detail',
  templateUrl: './inbox-user-detail.component.html',
  styleUrls: ['./inbox-user-detail.component.scss']
})
export class InboxUserDetailComponent implements OnChanges {

  @Input() user: InboxUser;
  @Input() item: InboxItem;
  @Input() phoneNumber: string;

  constructor(private userService: UserService) {
  }

  ngOnChanges(changes?: SimpleChanges) {
    if (changes.user && (this.user.score === undefined || this.user.responseRate === undefined || this.user.distanceInKm === undefined)) {
      this.userService.getInfo(this.user.id).subscribe((info: UserInfoResponse) => {
        this.user.score = info.scoring_stars;
        this.user.responseRate = info.response_rate;
        this.user.distanceInKm = this.userService.calculateDistanceFromItem(this.user, null);
      });
    }
  }
}
