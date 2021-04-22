export interface UserReportRequest {
  userId: string;
  itemHashId: string;
  conversationHash: string;
  reason: number;
  comments: string;
  targetCrm: 'zendesk';
}
