import { Review } from "./review";
import { MyReviews } from "./my-reviews";
import { ReviewItem } from "./review-item";
import { ReviewUser } from "./review-user";

export interface MyReviewsResponse {
  item: ReviewItem;
  review: Review;
  type: string;
  user: ReviewUser;
}

export interface MyReviewsData {
  data: MyReviews[];
  init: number;
}
