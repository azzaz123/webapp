import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserInfo } from '../../core/public-profile.interface';
import { PublicProfileService } from '../../core/services/public-profile.service';
import { PLACEHOLDER_AVATAR } from '@core/user/user';

@Component({
  selector: 'tsl-user-profile-header',
  templateUrl: './user-profile-header.component.html',
  styleUrls: ['./user-profile-header.component.scss'],
})
export class UserProfileHeaderComponent implements OnInit, OnDestroy {
  @Input() userId: string;
  userImg = PLACEHOLDER_AVATAR;
  subscriptions: Subscription[] = [];
  userInfo;

  constructor(private publicProfileService: PublicProfileService) {}

  ngOnInit(): void {
    this.getUserInformation();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getUserInformation(): void {
    this.subscriptions.push(
      this.publicProfileService
        .getUser(this.userId)
        .subscribe((userInfo: UserInfo) => {
          this.userInfo = userInfo;
          console.log('userInfo => ', userInfo);
        })
    );
  }
}
