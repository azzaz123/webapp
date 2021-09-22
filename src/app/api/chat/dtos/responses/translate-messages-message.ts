export interface TranslateMessagesMessage {
  id: string;
  from_self: boolean;
  text: string;
  timestamp: number;
  status: unknown;
  type: unknown;
  translation: string;
}
