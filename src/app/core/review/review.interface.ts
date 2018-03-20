export interface ReviewData {
  to_user_id: string;
  item_id: string;
  comments: string;
  score: number;
}

export interface ReviewDataBuyer extends ReviewData{
  conversation_id: string;
}

export interface ReviewDataSeller extends ReviewData{
  price: number;
}
