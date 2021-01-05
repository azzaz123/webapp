import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@core/user/user';
import { Image } from '@core/user/user-response.interface';
import { UserStats } from '@core/user/user-stats.interface';
import { forkJoin, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
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
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private publicProfileService: PublicProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }

  private getUser(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.getUserInfoAndStats();
    }
  }

  private getUserInfoAndStats(): void {
    this.loading = true;

    this.subscriptions.push(
      forkJoin([
        this.publicProfileService.getUser(this.userId),
        this.publicProfileService.getStats(this.userId),
      ])
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
            this.router.navigate(['/404']);
          }
        )
    );
  }

  private handleCoverImage(): void {
    if (!this.userInfo?.featured) {
      this.loading = false;
      return;
    }
    this.getCoverImage();
  }

  private getCoverImage(): void {
    this.publicProfileService
      .getCoverImage(this.userId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((coverImage: Image) => {
        this.userInfo.coverImage = coverImage;
      });
  }
}
