import { MyReviews } from "./my-reviews";

export interface MyReviewsResponse {
  item: {
    category_id: number;
    id: string;
    image: ReviewImageResponse;
    web_link: string;
    title: string;
  };
  review: {
    comments: string;
    date: number;
    scoring: number;
  };
  type: string;
  user: {
    id: string;
    image: ReviewImageResponse;
    micro_name: string;
    web_slug: string;
  };
}

export interface MyReviewsData {
  data: MyReviews[];
  init: number;
}

interface ReviewImageResponse {
  large: string;
  medium: string;
  original: string,
  original_height: number;
  original_width: number;
  small: string;
  xlarge: string;
  xsmall: string;
}
