import { Component, OnInit } from '@angular/core';
import { Review } from '../core/review/review';
import { ReviewService } from '../core/review/review.service';
import { UserService } from '../core/user/user.service';
import { User } from 'shield';
import { UserInfoResponse } from '../core/user/user-info.interface';
import { ReviewsData } from '../core/review/review-response.interface';
import { UserStatsResponse } from '../core/user/user-stats.interface';

@Component({
  selector: 'tsl-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  public reviews: Review[] = [];
  public loading: boolean = true;
  private init: number = 0;
  public end: boolean;
  public scrollTop: number;
  public userScore: number;
  public reviewsNum: number;

  constructor(private myReviewsService: ReviewService,
              private userService: UserService) { }

  ngOnInit() {
    this.getUserScore();
    this.getReviews();
    this.getReviewsNum();
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
    this.myReviewsService.getPaginationReviews(this.reviews.length).subscribe((reviewsData: ReviewsData) => {
      const reviews = reviewsData.data;
      this.init = reviewsData.init;
      this.reviews = append ? this.reviews.concat(reviews) : reviews;
      this.loading = false;
      this.end = !this.init;
    });
  }

  public getReviewsNum() {
    this.userService.getStats().subscribe((stats: UserStatsResponse) => {
      this.reviewsNum = stats.counters.reviews;
    });
  }

  public loadMore() {
    this.getReviews(true);
  }

}
