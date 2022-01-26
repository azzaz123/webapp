import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { CurrencyCode } from '@api/core/model/currency.interface';
import { DeliveryItemDetails } from '@api/core/model/delivery/item-detail/delivery-item-details.interface';
import { ToDomainMapper, InnerType } from '@api/core/utils/types';
import { DeliveryItemDetailsDto } from '../../dtos/delivery-item-detail-dto.interface';

type DeliveryCostsDto = InnerType<DeliveryItemDetailsDto, 'delivery_costs'>;
type BuyerAddressCost = InnerType<DeliveryCostsDto, 'buyer_address_cost'>;
type CarrierOfficeCost = InnerType<DeliveryCostsDto, 'carrier_office_cost'>;

export const mapDeliveryItemDetailsDtoToDeliveryItemDetails: ToDomainMapper<DeliveryItemDetailsDto, DeliveryItemDetails | null> = (
  input: DeliveryItemDetailsDto
) => {
  const { delivery_costs } = input;
  const isDeliveryCostsNull = !delivery_costs;
  if (isDeliveryCostsNull) {
    return null;
  }

  const { buyer_address_cost, carrier_office_cost } = delivery_costs;

  const minimumPurchaseCostRaw = getLowestCost(buyer_address_cost, carrier_office_cost);

  const deliveryItemDetails: DeliveryItemDetails = {
    minimumPurchaseCost: mapNumberAndCurrencyCodeToMoney({
      number: minimumPurchaseCostRaw.amount,
      currency: minimumPurchaseCostRaw.currency as CurrencyCode,
    }),
  };

  return deliveryItemDetails;
};

const getLowestCost = (buyerAddressCost: BuyerAddressCost, carrierOfficeCost: CarrierOfficeCost): BuyerAddressCost | CarrierOfficeCost => {
  const isBuyerAddressCheaper = buyerAddressCost.amount < carrierOfficeCost.amount;
  return isBuyerAddressCheaper ? buyerAddressCost : carrierOfficeCost;
};
