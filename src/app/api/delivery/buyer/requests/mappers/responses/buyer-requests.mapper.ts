import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { Unpacked, ToDomainMapper } from '@api/core/utils/types';
import { BuyerRequestsDto } from '../../dtos/buyer-request-dto.interface';

type BuyerRequestDto = Unpacked<BuyerRequestsDto>;

export const mapBuyerRequestsDtoToBuyerRequests: ToDomainMapper<BuyerRequestsDto, BuyerRequest[]> = (input: BuyerRequestsDto) => {
  return input.map((buyerRequestDto: BuyerRequestDto) => {
    const { id } = buyerRequestDto;

    const buyerRequest: BuyerRequest = {
      id,
    };

    return buyerRequest;
  });
};
