import { LeadResponse } from './lead-response.interface';

export interface ConversationResponse extends LeadResponse {
  expected_visit?: boolean;
  conversation_id?: string;
  other_user_id?: string;
}
