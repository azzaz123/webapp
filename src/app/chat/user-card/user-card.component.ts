import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { User } from '../../core/user/user';
import { ItemService } from '../../core/item/item.service';
import { ItemDataResponse } from '../../core/item/item-response.interface';
import { UserService } from '../../core/user/user.service';
import { UserInfoResponse } from '../../core/user/user-info.interface';
import { UserStatsResponse } from '../../core/user/user-stats.interface';

@Component({
  selector: 'tsl-user',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnChanges {

  @Input() user: User;
  @Input() phone: string;

  constructor(private itemService: ItemService,
              private userService: UserService) {
  }

  ngOnChanges(changes?: any) {
    if (changes.user) {
      if (!this.user.sellingItem) {
        this.itemService.getLatest(this.user.id).subscribe((res: ItemDataResponse) => {
          this.user.sellingItem = res.data;
          this.user.itemsCount = res.count;
        });
      }
      if (this.user.scoringStars === undefined || this.user.responseRate === undefined) {
        this.userService.getInfo(this.user.id).subscribe((info: UserInfoResponse) => {
          this.user.scoringStars = info.scoring_stars;
          this.user.responseRate = info.response_rate;
        });
      }
      if (this.user.receivedReports === undefined) {
        this.userService.getUserStats(this.user.id).subscribe((info: UserStatsResponse) => {
          this.user.receivedReports = info.counters.reports_received;
        });
      }
    }
  }

}
