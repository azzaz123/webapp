import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { BUYER_REQUEST_STATUS } from '@api/core/model/delivery/buyer-request/status/buyer-request-status.enum';

export const MOCK_BUYER_REQUESTS: BuyerRequest[] = [
  {
    id: '0bcf6d92-4b8a-4ac4-a74c-67246845f447',
    status: BUYER_REQUEST_STATUS.REJECTED,
  },
  {
    id: 'cc9c2911-e068-4404-b579-baadda664693',
    status: BUYER_REQUEST_STATUS.EXPIRED,
  },
  {
    id: 'bc95d542-517c-4850-aea0-91de4162232a',
    status: BUYER_REQUEST_STATUS.ACCEPTED,
  },
];
