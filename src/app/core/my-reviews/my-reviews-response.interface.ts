import { Review } from "./review";
import { User } from 'shield';
import { MyReviews } from "./my-reviews";
import { ReviewItem } from "./review-item";

export interface MyReviewsResponse {
  item: ReviewItem;
  review: Review;
  type: string;
  user: User;
}

export interface MyReviewsData {
  data: MyReviews[];
  init: number;
}
