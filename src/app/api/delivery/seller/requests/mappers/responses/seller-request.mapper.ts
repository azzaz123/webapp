import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { CurrencyCode } from '@api/core/model/currency.interface';
import { SellerRequestBuyer } from '@api/core/model/delivery/seller-requests/seller-request-buyer.interface';
import { SellerRequestPaymentAndRequestStatus } from '@api/core/model/delivery/seller-requests/seller-request-payment-and-request-status.interface';
import { SellerRequestRevenue } from '@api/core/model/delivery/seller-requests/seller-request-revenue.interface';
import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { SELLER_PAYMENT_STATUS } from '@api/core/model/delivery/seller-requests/status/seller-payment-status.enum';
import { SELLER_REQUEST_STATUS } from '@api/core/model/delivery/seller-requests/status/seller-request-status.enum';
import { Money } from '@api/core/model/money.interface';
import { ToDomainMapper } from '@api/core/utils/types';
import {
  SellerPaymentStatusDto,
  SellerRequestBuyerAddressDto,
  SellerRequestCostDto,
  SellerRequestDto,
  SellerRequestPaymentAndRequestStatusDto,
  SellerRequestRevenueDto,
  SellerRequestStatusDto,
} from '../../dtos/seller-request-dto.interface';

const mapSellerPaymentStatusToDomain: Record<SellerPaymentStatusDto, SELLER_PAYMENT_STATUS> = {
  pending: SELLER_PAYMENT_STATUS.PENDING,
  ready: SELLER_PAYMENT_STATUS.READY,
  'in progress': SELLER_PAYMENT_STATUS.IN_PROGRESS,
  succeeded: SELLER_PAYMENT_STATUS.SUCCEEDED,
  failed: SELLER_PAYMENT_STATUS.FAILED,
  'cancelled by buyer': SELLER_PAYMENT_STATUS.CANCELLED_BY_BUYER,
};

const mapSellerRequestStatusToDomain: Record<SellerRequestStatusDto, SELLER_REQUEST_STATUS> = {
  pending: SELLER_REQUEST_STATUS.PENDING,
  failed: SELLER_REQUEST_STATUS.FAILED,
  accepted: SELLER_REQUEST_STATUS.ACCEPTED,
  rejected: SELLER_REQUEST_STATUS.REJECTED,
  expired: SELLER_REQUEST_STATUS.EXPIRED,
  cancelled: SELLER_REQUEST_STATUS.CANCELLED,
  'payment required': SELLER_REQUEST_STATUS.PAYMENT_REQUIRED,
};

export const mapSellerRequestDtoToSellerRequest: ToDomainMapper<SellerRequestDto, SellerRequest> = (input: SellerRequestDto) => {
  const creationDate: Date = new Date(input.created_at);
  const buyer: SellerRequestBuyer = getSellerRequestBuyer(input.buyer_user_hash, input.buyer_address);
  const failReason: SellerRequestPaymentAndRequestStatus = getSellerRequestPaymentAndRequestStatus(input.fail_reason);
  const offeredPrice: Money = mapMoneyToDomain(input.offered_price);
  const sellerRevenue: SellerRequestRevenue = getSellerRevenue(input.seller_revenue);
  const status: SellerRequestPaymentAndRequestStatus = getSellerRequestPaymentAndRequestStatus(input.status);

  return {
    id: input.id,
    itemId: input.item_hash,
    buyer,
    creationDate,
    failReason,
    offeredPrice,
    sellerRevenue,
    status,
  };
};

const getSellerRequestBuyer = (id: string, address: SellerRequestBuyerAddressDto): SellerRequestBuyer => {
  return {
    id,
    address,
  };
};

const getSellerRequestPaymentAndRequestStatus = (
  properties: SellerRequestPaymentAndRequestStatusDto
): SellerRequestPaymentAndRequestStatus => {
  const payment: SELLER_PAYMENT_STATUS = mapSellerPaymentStatusToDomain[properties.payment];
  const request: SELLER_REQUEST_STATUS = mapSellerRequestStatusToDomain[properties.request];

  return {
    payment,
    request,
  };
};

const getSellerRevenue = (revenue: SellerRequestRevenueDto): SellerRequestRevenue => {
  const deliveryCost: Money = mapMoneyToDomain(revenue.delivery_cost);
  const feesCost: Money = mapMoneyToDomain(revenue.fees_cost);
  const itemPrice: Money = mapMoneyToDomain(revenue.item);
  const totalPrice: Money = mapMoneyToDomain(revenue.total);

  return {
    deliveryCost,
    feesCost,
    itemPrice,
    totalPrice,
  };
};

const mapMoneyToDomain = (costDto: SellerRequestCostDto): Money => {
  return mapNumberAndCurrencyCodeToMoney({
    number: costDto.amount,
    currency: costDto.currency as CurrencyCode,
  });
};
