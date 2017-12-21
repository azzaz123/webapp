import { Component, OnInit } from '@angular/core';
import { MyReviews } from "../core/my-reviews/my-reviews";
import { MyReviewsService } from "../core/my-reviews/my-reviews.service";
import { MyReviewsData } from "../core/my-reviews/my-reviews-response.interface";
import { UserService } from "../core/user/user.service";
import { User } from "shield";

@Component({
  selector: 'tsl-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  public reviews: MyReviews[] = [];
  public loading: boolean = true;
  private init: number = 0;
  public end: boolean;
  public scrollTop: number;
  public userScore: number;
  
  constructor(public myReviewsService: MyReviewsService,
              private userService: UserService) { }

  ngOnInit() {
    this.getUserReview();
    this.getReviews();
  }

  private getUserReview(){
    this.userService.me().subscribe((user: User) => {
      this.userScore = user.scoringStars;
    });
  }

  private getReviews(append?: boolean) {
    this.loading = true;
    if (!append) {
      this.reviews = [];
    }
    this.myReviewsService.myReviews(this.init).subscribe((reviewsData: MyReviewsData) => {
      const reviews = reviewsData.data;
      this.init = reviewsData.init;
      this.reviews = append ? this.reviews.concat(reviews) : reviews;
      this.loading = false;
      this.end = !this.init;
    });
  }

  public loadMore() {
    this.getReviews(true);
  }

}
