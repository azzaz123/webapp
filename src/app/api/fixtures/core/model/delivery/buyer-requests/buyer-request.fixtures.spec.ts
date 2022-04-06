import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { BUYER_REQUEST_PAYMENT_STATUS } from '@api/core/model/delivery/buyer-request/status/buyer-payment-status.enum';
import { BUYER_REQUEST_STATUS } from '@api/core/model/delivery/buyer-request/status/buyer-request-status.enum';

export const MOCK_BUYER_REQUEST_ACCEPTED: BuyerRequest = {
  id: 'bc95d542-517c-4850-aea0-91de4162232a',
  status: {
    request: BUYER_REQUEST_STATUS.ACCEPTED,
    payment: BUYER_REQUEST_PAYMENT_STATUS.SUCCEEDED,
  },
};

export const MOCK_BUYER_REQUEST_PENDING: BuyerRequest = {
  id: '799a7381-0eae-4a47-a03b-b412ea0f7a2e',
  status: {
    request: BUYER_REQUEST_STATUS.PENDING,
    payment: BUYER_REQUEST_PAYMENT_STATUS.SUCCEEDED,
  },
};

export const MOCK_BUYER_REQUEST_REJECTED: BuyerRequest = {
  id: '0bcf6d92-4b8a-4ac4-a74c-67246845f447',
  status: {
    request: BUYER_REQUEST_STATUS.REJECTED,
    payment: BUYER_REQUEST_PAYMENT_STATUS.SUCCEEDED,
  },
};

export const MOCK_BUYER_REQUEST_EXPIRED: BuyerRequest = {
  id: 'cc9c2911-e068-4404-b579-baadda664693',
  status: {
    request: BUYER_REQUEST_STATUS.EXPIRED,
    payment: BUYER_REQUEST_PAYMENT_STATUS.SUCCEEDED,
  },
};

export const MOCK_BUYER_REQUEST_PAYMENT_READY: BuyerRequest = {
  id: 'cc9c2911-e068-4404-b579-baadda664693',
  status: {
    request: BUYER_REQUEST_STATUS.PENDING,
    payment: BUYER_REQUEST_PAYMENT_STATUS.READY,
  },
};

export const MOCK_BUYER_REQUESTS: BuyerRequest[] = [MOCK_BUYER_REQUEST_REJECTED, MOCK_BUYER_REQUEST_EXPIRED, MOCK_BUYER_REQUEST_ACCEPTED];
