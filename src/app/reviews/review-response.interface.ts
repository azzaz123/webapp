import { Review } from './review';

export interface ReviewResponse {
  type: string;
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
  user: {
    id: string;
    image: ReviewImageResponse;
    micro_name: string;
    web_slug: string;
  };
}

export interface ReviewsData {
  data: Review[];
  init: number;
}

interface ReviewImageResponse {
  large: string;
  medium: string;
  original: string;
  original_height: number;
  original_width: number;
  small: string;
  xlarge: string;
  xsmall: string;
}
