import { Component, OnInit } from '@angular/core';
import { UserInfoResponse } from 'app/core/user/user-info.interface';
import { UserStats } from 'app/core/user/user-stats.interface';
import { UserService } from 'app/core/user/user.service';
import { Review } from '../core/review';
import { ReviewsData } from '../core/review-response.interface';
import { UserReviewService } from '../core/user-review.service';

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

  constructor(private myReviewsService: UserReviewService, private userService: UserService) {}

  ngOnInit() {
    this.getUserScore();
    this.getReviews();
    this.getNumberOfReviews();
  }

  public getUserScore() {
    const user = this.userService.user;

    this.userService.getInfo(user.id).subscribe((info: UserInfoResponse) => {
      this.userScore = info.scoring_stars;
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

  public getNumberOfReviews() {
    this.userService.getStats().subscribe((stats: UserStats) => {
      this.numberOfReviews = stats.counters.reviews;
    });
  }

  public loadMore() {
    this.getReviews(true);
  }
}
