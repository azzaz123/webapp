import { Component, Input, OnInit } from '@angular/core';
import { User } from '@core/user/user';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { UserStats } from '@core/user/user-stats.interface';
import { USER_INFO_SIZE } from '@public/shared/components/user-basic-info/constants/user-basic-info-constants';
import { Item } from '@core/item/item';

@Component({
  selector: 'tsl-item-detail-header',
  templateUrl: './item-detail-header.component.html',
  styleUrls: ['./item-detail-header.component.scss'],
})
export class ItemDetailHeaderComponent implements OnInit {
  @Input() user: User;
  @Input() item: Item;
  @Input() isOwner = false;

  public readonly USER_INFO_SIZE = USER_INFO_SIZE;
  public userStats: UserStats;

  constructor(private publicProfileService: PublicProfileService) {}

  ngOnInit(): void {
    this.initHeader();
  }

  public toggleItemFavorite(): void {}

  private initHeader() {
    this.publicProfileService.getStats(this.user?.id).subscribe((userStats) => {
      this.userStats = userStats;
    });
  }
}
