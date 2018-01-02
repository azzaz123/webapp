import { Component, OnInit } from '@angular/core';
import { MyReviews } from "../core/my-reviews/my-reviews";
import { MyReviewsService } from "../core/my-reviews/my-reviews.service";
import { MyReviewsData } from "../core/my-reviews/my-reviews-response.interface";
import { UserService } from "../core/user/user.service";
import { User } from "shield";
import { UserInfoResponse } from "../core/user/user-info.interface";

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
  
  constructor(private myReviewsService: MyReviewsService,
              private userService: UserService) { }

  ngOnInit() {
    this.getUserReview();
    this.getReviews();
  }

  public getUserReview(){
    this.userService.me().subscribe((user: User) => {
      this.userService.getInfo(user.id).subscribe((info: UserInfoResponse) => {
        this.userScore = info.scoring_stars;
      });
    });
  }

  public getReviews(append?: boolean) {
    this.loading = true;
    this.myReviewsService.myReviews(this.reviews.length).subscribe((reviewsData: MyReviewsData) => {
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
