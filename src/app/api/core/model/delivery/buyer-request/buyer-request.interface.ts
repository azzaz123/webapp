import { BUYER_REQUEST_STATUS } from './status/buyer-request-status.enum';

export interface BuyerRequest {
  id: string;
  status: BUYER_REQUEST_STATUS;
}
