import { LeadResponse } from './lead-response.interface';

export interface ConversationResponse extends LeadResponse {
  expected_visit: boolean;
  conversation_id?: string,
  other_user_id?: string,
}

export interface NewConversationResponse {
  seller_user_id: string;
  buyer_user_id: string;
  item_id: string;
  modified_date: number;
  conversation_id: string;
}
