import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { User } from '../../core/user/user';
import { UserService } from '../../core/user/user.service';
import { UserInfoResponse } from '../../core/user/user-info.interface';
import { UserStatsResponse } from '../../core/user/user-stats.interface';
import { ItemDataResponse } from '../../core/item/item-response.interface';
import { ItemService } from '../../core/item/item.service';

@Component({
  selector: 'tsl-user-card-calls',
  templateUrl: './user-card-calls.component.html',
  styleUrls: ['./user-card-calls.component.scss']
})
export class UserCardCallsComponent implements OnChanges {

  @Input() user: User;

  constructor(private userService: UserService, private itemService: ItemService) { }

  ngOnChanges(changes?: any) {
    if (changes.user) {
      if (!this.user.sellingItem) {
        this.itemService.getLatest(this.user.id).subscribe((res: ItemDataResponse) => {
          this.user.sellingItem = res.data;
        });
      }
      if (!this.user.scoringStars) {
        this.userService.getInfo(this.user.id).subscribe((info: UserInfoResponse) => {
          this.user.scoringStars = info.scoring_stars;
        });
      }
      if (!this.user.receivedReports) {
        this.userService.getUserStats(this.user.id).subscribe((info: UserStatsResponse) => {
          this.user.receivedReports = info.counters.reports_received;
        });
      }
    }
  }
}
