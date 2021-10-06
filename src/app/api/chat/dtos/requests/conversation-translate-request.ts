export interface ConversationTranslateRequest {
  conversation_id: string;
  first_message_timestamp: number;
  first_message_id: string;
  last_message_timestamp: number;
  last_message_id: string;
}
