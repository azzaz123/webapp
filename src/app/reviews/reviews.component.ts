import { Component, OnInit } from '@angular/core';
import { Review } from "../core/review/review";
import { ReviewService } from "../core/review/review.service";
import { ReviewsData } from "../core/review/review-response.interface";

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
  
  constructor(public reviewService: ReviewService) { }

  ngOnInit() {
    this.getReviews();
  }

  private getReviews(append?: boolean) {
    this.loading = true;
    if (!append) {
      this.reviews = [];
    }
    this.reviewService.myReviews(this.init).subscribe((reviewsData: ReviewsData) => {
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
