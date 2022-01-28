import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { CurrencyCode } from '@api/core/model/currency.interface';
import { DeliveryItemDetails } from '@api/core/model/delivery/item-detail/delivery-item-details.interface';
import { ToDomainMapper, InnerType } from '@api/core/utils/types';
import { DeliveryItemDetailsDto } from '../../dtos/delivery-item-detail-dto.interface';

type DeliveryCostsDto = InnerType<DeliveryItemDetailsDto, 'delivery_costs'>;
type BuyerAddressCostDto = InnerType<DeliveryCostsDto, 'buyer_address_cost'>;
type CarrierOfficeCostDto = InnerType<DeliveryCostsDto, 'carrier_office_cost'>;
type DeliveryCostDto = BuyerAddressCostDto | CarrierOfficeCostDto;

export const mapDeliveryItemDetailsDtoToDeliveryItemDetails: ToDomainMapper<DeliveryItemDetailsDto, DeliveryItemDetails | null> = (
  input: DeliveryItemDetailsDto
) => {
  const { delivery_costs } = input;
  const isDeliveryCostsNull: boolean = !delivery_costs;
  if (isDeliveryCostsNull) {
    return null;
  }

  const { buyer_address_cost, carrier_office_cost } = delivery_costs;

  const minimumPurchaseCostRaw: DeliveryCostDto = getLowestCost(buyer_address_cost, carrier_office_cost);

  const deliveryItemDetails: DeliveryItemDetails = {
    minimumPurchaseCost: mapNumberAndCurrencyCodeToMoney({
      number: minimumPurchaseCostRaw.amount,
      currency: minimumPurchaseCostRaw.currency as CurrencyCode,
    }),
  };

  return deliveryItemDetails;
};

const getLowestCost = (buyerAddressCost: BuyerAddressCostDto, carrierOfficeCost: CarrierOfficeCostDto): DeliveryCostDto => {
  const isBuyerAddressCheaper = buyerAddressCost.amount < carrierOfficeCost.amount;
  return isBuyerAddressCheaper ? buyerAddressCost : carrierOfficeCost;
};
