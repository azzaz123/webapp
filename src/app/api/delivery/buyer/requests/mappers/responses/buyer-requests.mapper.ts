import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { BUYER_REQUEST_STATUS } from '@api/core/model/delivery/buyer-request/status/buyer-request-status.enum';
import { Unpacked, ToDomainMapper, InnerType } from '@api/core/utils/types';
import { BuyerRequestsDto } from '../../dtos/buyer-request-dto.interface';

type BuyerRequestDto = Unpacked<BuyerRequestsDto>;
type BuyerRequestStatusDto = InnerType<BuyerRequestDto, 'status'>;
type BuyerRequestStatusRequestDto = InnerType<BuyerRequestStatusDto, 'request'>;

export const mapBuyerRequestsDtoToBuyerRequests: ToDomainMapper<BuyerRequestsDto, BuyerRequest[]> = (input: BuyerRequestsDto) => {
  return input.map((buyerRequestDto: BuyerRequestDto) => {
    const { id, status: statusRaw } = buyerRequestDto;

    const status: BUYER_REQUEST_STATUS = mapStatusToDomain[statusRaw.request];

    const buyerRequest: BuyerRequest = {
      id,
      status,
    };

    return buyerRequest;
  });
};

const mapStatusToDomain: Record<BuyerRequestStatusRequestDto, BUYER_REQUEST_STATUS> = {
  pending: BUYER_REQUEST_STATUS.PENDING,
  failed: BUYER_REQUEST_STATUS.FAILED,
  accepted: BUYER_REQUEST_STATUS.ACCEPTED,
  rejected: BUYER_REQUEST_STATUS.REJECTED,
  expired: BUYER_REQUEST_STATUS.EXPIRED,
  cancelled: BUYER_REQUEST_STATUS.CANCELLED,
  'payment required': BUYER_REQUEST_STATUS.PAYMENT_REQUIRED,
};
