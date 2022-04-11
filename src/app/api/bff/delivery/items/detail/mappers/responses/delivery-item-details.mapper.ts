import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { CurrencyCode } from '@api/core/model/currency.interface';
import { DeliveryItemDetails } from '@api/core/model/delivery/item-detail/delivery-item-details.interface';
import { Money } from '@api/core/model/money.interface';
import { ToDomainMapper, InnerType } from '@api/core/utils/types';
import { DeliveryItemDetailsDto } from '../../dtos/delivery-item-detail-dto.interface';

type DeliveryCostsDto = InnerType<DeliveryItemDetailsDto, 'delivery_costs'>;
type BuyerAddressCostDto = InnerType<DeliveryCostsDto, 'buyer_address_cost'>;
type CarrierOfficeCostDto = InnerType<DeliveryCostsDto, 'carrier_office_cost'>;

export const mapDeliveryItemDetailsDtoToDeliveryItemDetails: ToDomainMapper<DeliveryItemDetailsDto, DeliveryItemDetails> = (
  input: DeliveryItemDetailsDto
) => {
  const { delivery_costs, shipping_allowed: isShippingAllowed, shippable: isShippable } = input;
  const minimumPurchaseCost = getLowestCostFromDeliveryCost(delivery_costs);

  const deliveryItemDetails: DeliveryItemDetails = {
    minimumPurchaseCost,
    isShippingAllowed,
    isShippable,
  };

  return deliveryItemDetails;
};

const getLowestCostFromDeliveryCost = (deliveryCostDto: DeliveryCostsDto): Money | null => {
  if (!deliveryCostDto) {
    return null;
  }
  const { buyer_address_cost, carrier_office_cost } = deliveryCostDto;
  const isBuyerAddressCheaper: boolean = buyer_address_cost.amount < carrier_office_cost.amount;
  const cheapestCost: BuyerAddressCostDto | CarrierOfficeCostDto = isBuyerAddressCheaper ? buyer_address_cost : carrier_office_cost;

  const lowestCost: Money = mapNumberAndCurrencyCodeToMoney({
    number: cheapestCost.amount,
    currency: cheapestCost.currency as CurrencyCode,
  });
  return lowestCost;
};
