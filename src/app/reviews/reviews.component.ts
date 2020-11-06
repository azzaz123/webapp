import { Component, OnInit } from '@angular/core';
import { Review } from './review';
import { UserReviewService } from './user-review.service';
import { UserService } from '../core/user/user.service';
import { UserInfoResponse } from '../core/user/user-info.interface';
import { ReviewsData } from './review-response.interface';
import { UserStats } from '../core/user/user-stats.interface';
import { User } from '../core/user/user';

@Component({
  selector: 'tsl-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  public reviews: Review[] = [];
  public loading = true;
  private init = 0;
  public end: boolean;
  public scrollTop: number;
  public userScore: number;
  public numberOfReviews: number;

  constructor(
    private myReviewsService: UserReviewService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getUserScore();
    this.getReviews();
    this.getNumberOfReviews();
  }

  public getUserScore() {
    this.userService.me().subscribe((user: User) => {
      this.userService.getInfo(user.id).subscribe((info: UserInfoResponse) => {
        this.userScore = info.scoring_stars;
      });
    });
  }

  public getReviews(append?: boolean) {
    this.loading = true;
    this.myReviewsService
      .getPaginationReviews(this.reviews.length)
      .subscribe((reviewsData: ReviewsData) => {
        const reviews = reviewsData.data;
        this.init = reviewsData.init;
        this.reviews = append ? this.reviews.concat(reviews) : reviews;
        this.loading = false;
        this.end = !this.init;
      });
  }

  public getNumberOfReviews() {
    this.userService.getStats().subscribe((stats: UserStats) => {
      this.numberOfReviews = stats.counters.reviews;
    });
  }

  public loadMore() {
    this.getReviews(true);
  }
}
