import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { BUYER_REQUEST_PAYMENT_STATUS } from '@api/core/model/delivery/buyer-request/status/buyer-payment-status.enum';
import { BUYER_REQUEST_STATUS } from '@api/core/model/delivery/buyer-request/status/buyer-request-status.enum';
import { Unpacked, ToDomainMapper, InnerType } from '@api/core/utils/types';
import { BuyerRequestsDto } from '../../dtos/buyer-request-dto.interface';

type BuyerRequestDto = Unpacked<BuyerRequestsDto>;
type BuyerRequestStatusRequestDto = 'pending' | 'failed' | 'accepted' | 'rejected' | 'expired' | 'cancelled' | 'payment required';
type BuyerRequestPaymentStatusRequestDto = 'null' | 'pending' | 'ready' | 'in progress' | 'succeeded' | 'failed';

export const mapBuyerRequestsDtoToBuyerRequests: ToDomainMapper<BuyerRequestsDto, BuyerRequest[]> = (input: BuyerRequestsDto) => {
  return input.map((buyerRequestDto: BuyerRequestDto) => {
    const { id, status: statusRaw } = buyerRequestDto;

    const buyerRequest: BuyerRequest = {
      id,
      status: {
        request: mapRequestStatusToDomain[statusRaw.request] || BUYER_REQUEST_STATUS.NONE,
        payment: mapPaymentStatusToDomain[statusRaw.payment] || BUYER_REQUEST_PAYMENT_STATUS.NONE,
      },
    };

    return buyerRequest;
  });
};

const mapRequestStatusToDomain: Record<BuyerRequestStatusRequestDto, BUYER_REQUEST_STATUS> = {
  pending: BUYER_REQUEST_STATUS.PENDING,
  failed: BUYER_REQUEST_STATUS.FAILED,
  accepted: BUYER_REQUEST_STATUS.ACCEPTED,
  rejected: BUYER_REQUEST_STATUS.REJECTED,
  expired: BUYER_REQUEST_STATUS.EXPIRED,
  cancelled: BUYER_REQUEST_STATUS.CANCELLED,
  'payment required': BUYER_REQUEST_STATUS.PAYMENT_REQUIRED,
};

const mapPaymentStatusToDomain: Record<BuyerRequestPaymentStatusRequestDto, BUYER_REQUEST_PAYMENT_STATUS> = {
  null: BUYER_REQUEST_PAYMENT_STATUS.NONE,
  pending: BUYER_REQUEST_PAYMENT_STATUS.PENDING,
  ready: BUYER_REQUEST_PAYMENT_STATUS.READY,
  'in progress': BUYER_REQUEST_PAYMENT_STATUS.IN_PROGRESS,
  succeeded: BUYER_REQUEST_PAYMENT_STATUS.SUCCEEDED,
  failed: BUYER_REQUEST_PAYMENT_STATUS.FAILED,
};
