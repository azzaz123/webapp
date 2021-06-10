import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { filter, finalize } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdSlotConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services/ads/ads.service';
import { DeviceService } from '@core/device/device.service';
import { SlugsUtilService } from '@core/services/slugs-util/slugs-util.service';
import { User } from '@core/user/user';
import { Image, UserFavourited } from '@core/user/user-response.interface';
import { UserStats } from '@core/user/user-stats.interface';
import { Review } from '@private/features/reviews/core/review';
import { IsCurrentUserPipe } from '@public/core/pipes/is-current-user/is-current-user.pipe';
import { PUBLIC_PATHS, PUBLIC_PATH_PARAMS } from '@public/public-routing-constants';
import { PUBLIC_PROFILE_AD } from '../core/ads/public-profile-ads.config';
import { PublicProfileTrackingEventsService } from '../core/services/public-profile-tracking-events/public-profile-tracking-events.service';
import { PublicProfileService } from '../core/services/public-profile.service';
import { PUBLIC_PROFILE_PATHS } from '../public-profile-routing-constants';
import { UserService } from '@core/user/user.service';

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
  public reviews: Review[];
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
    private slugsUtilService: SlugsUtilService,
    private publicProfileTrackingEventsService: PublicProfileTrackingEventsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(this.routeParamsSubscription(), this.routerEventsSubscription());
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public userFavouriteChanged(isFavourite: boolean): void {
    this.isFavourited = isFavourite;
    this.publicProfileTrackingEventsService.trackFavouriteOrUnfavouriteUserEvent(this.userInfo, isFavourite);
  }

  private routeParamsSubscription(): Subscription {
    return this.route.params.subscribe((params) => {
      const webSlug = params[PUBLIC_PATH_PARAMS.WEBSLUG];
      const userUUID = this.slugsUtilService.getUUIDfromSlug(webSlug);
      this.adsService.setSlots([this.adSlot]);
      this.getUser(userUUID);
    });
  }

  private routerEventsSubscription(): Subscription {
    return this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.trackViewEvents(event.url);
    });
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
      forkJoin([
        this.publicProfileService.getUser(this.userId, false),
        this.publicProfileService.getStats(this.userId),
        this.publicProfileService.getShippingCounter(this.userId),
      ])
        .pipe(
          finalize(() => {
            this.handleCoverImage();
            this.trackViewProfileEvent();
          })
        )
        .subscribe(
          ([userInfo, userStats, shippingCounter]: [User, UserStats, number]) => {
            this.userInfo = userInfo;
            this.userStats = {
              ratings: userStats.ratings,
              counters: { ...userStats.counters, shipping_counter: shippingCounter },
            };
            this.trackViewEvents(this.router.url);
          },
          () => {
            this.router.navigate([`/${PUBLIC_PATHS.NOT_FOUND}`]);
          }
        )
    );
  }

  private isReviewsUrl(url: string): boolean {
    return url.endsWith(PUBLIC_PROFILE_PATHS.REVIEWS);
  }

  private trackViewEvents(url: string): void {
    if (this.isReviewsUrl(url)) {
      this.trackViewOwnOrOtherReviews();
    }
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
    const isOurOwnUser = this.isCurrentUserPipe.transform(this.userId);
    const isLogged = this.userService.isLogged;

    if (!isOurOwnUser && isLogged) {
      this.getFavouriteUser();
    }
  }

  private trackViewProfileEvent(): void {
    const isOwnUser = this.isCurrentUserPipe.transform(this.userId);

    if (isOwnUser) {
      this.publicProfileTrackingEventsService.trackViewOwnProfile(this.userInfo.featured);
    } else {
      this.publicProfileTrackingEventsService.trackViewOtherProfile(this.userInfo, this.userStats.counters.publish);
    }
  }

  private trackViewOwnOrOtherReviews(): void {
    const isOwnUser = this.isCurrentUserPipe.transform(this.userId);

    this.publicProfileTrackingEventsService.trackViewOwnReviewsorViewOtherReviews(this.userInfo, this.userStats, isOwnUser);
  }

  private getFavouriteUser(): void {
    this.publicProfileService.isFavourite(this.userId).subscribe((isFavourited: UserFavourited) => {
      this.isFavourited = isFavourited.favorited;
    });
  }
}
