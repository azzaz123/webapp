import { Review } from "./review";

export interface ReviewResponse {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  saleDate: string;
  transactionUser: string;
}

export interface ReviewsData {
  data: Review[];
  init: number;
}