import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdSlotConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services/ads/ads.service';
import { DeviceService } from '@core/device/device.service';
import { SlugsUtilService } from '@core/services/slugs-util/slugs-util.service';
import { User } from '@core/user/user';
import { Image, UserFavourited } from '@core/user/user-response.interface';
import { UserStats } from '@core/user/user-stats.interface';
import { IsCurrentUserPipe } from '@public/core/pipes/is-current-user/is-current-user.pipe';
import { PUBLIC_PATHS, PUBLIC_PATH_PARAMS } from '@public/public-routing-constants';
import { forkJoin, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { PUBLIC_PROFILE_AD } from '../core/ads/public-profile-ads.config';
import { PublicProfileService } from '../core/services/public-profile.service';

@Component({
  selector: 'tsl-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss'],
})
export class PublicProfileComponent implements OnInit, OnDestroy {
  public userId: string;
  public userStats: UserStats;
  public userInfo: User;
  public loading = false;
  public isFavourited = false;
  private subscriptions: Subscription[] = [];

  isMobile: boolean;

  readonly adSlot: AdSlotConfiguration = PUBLIC_PROFILE_AD;

  constructor(
    private route: ActivatedRoute,
    private publicProfileService: PublicProfileService,
    private router: Router,
    private deviceService: DeviceService,
    private adsService: AdsService,
    private isCurrentUserPipe: IsCurrentUserPipe,
    private slugsUtilService: SlugsUtilService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const webSlug = params[PUBLIC_PATH_PARAMS.WEBSLUG];
      const userUUID = this.slugsUtilService.getUUIDfromSlug(webSlug);
      this.getUser(userUUID);
    });

    this.isMobile = this.deviceService.isMobile();
    this.adsService.setSlots([this.adSlot]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  private getUser(userUUID: string): void {
    this.userId = userUUID;
    if (this.userId) {
      this.getUserInfoAndStats();
      this.initializeFavouriteUser();
    }
  }

  private getUserInfoAndStats(): void {
    this.loading = true;

    this.subscriptions.push(
      forkJoin([this.publicProfileService.getUser(this.userId), this.publicProfileService.getStats(this.userId)])
        .pipe(
          finalize(() => {
            this.handleCoverImage();
          })
        )
        .subscribe(
          ([userInfo, userStats]: [User, UserStats]) => {
            this.userInfo = userInfo;
            this.userStats = userStats;
          },
          () => {
            this.router.navigate([`/${PUBLIC_PATHS.NOT_FOUND}`]);
          }
        )
    );
  }

  private handleCoverImage(): void {
    if (this.userInfo?.featured) {
      return this.getCoverImage();
    }
    this.loading = false;
  }

  private getCoverImage(): void {
    this.publicProfileService
      .getCoverImage(this.userId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((coverImage: Image) => {
        this.userInfo.coverImage = coverImage;
      });
  }

  private initializeFavouriteUser(): void {
    this.isCurrentUserPipe.transform(this.userId).subscribe((isOurOwnUser: boolean) => {
      if (!isOurOwnUser) {
        this.getFavouriteUser();
      }
    });
  }

  private getFavouriteUser(): void {
    this.publicProfileService.isFavourite(this.userId).subscribe((isFavourited: UserFavourited) => {
      this.isFavourited = isFavourited.favorited;
    });
  }
}
