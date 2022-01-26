import { DeliveryCostsItem } from '@api/bff/delivery/costs/interfaces/delivery-costs-item.interface';
import { DeliveryCostsItemDto, DeliveryCostsMoneyDto } from '@api/bff/delivery/costs/dtos';
import { mapCurrencyCodeToCurrency, mapNumberToNumericAmount } from '@api/core/mappers';
import { Money } from '@api/core/model/money.interface';
import { ToDomainMapper } from '@api/core/utils/types';

export const mapDeliveryCostsItemDtoToDeliveryCostsItem: ToDomainMapper<DeliveryCostsItemDto, DeliveryCostsItem> = (
  input: DeliveryCostsItemDto
): DeliveryCostsItem => {
  const { buyer_address_cost: buyerAddressCost, carrier_office_cost: carrierOfficeCost } = input;

  return {
    buyerAddressCost: getMoney(buyerAddressCost),
    carrierOfficeCost: getMoney(carrierOfficeCost),
  };
};

const getMoney: ToDomainMapper<DeliveryCostsMoneyDto, Money> = (deliveryCostsMoneyDto: DeliveryCostsMoneyDto): Money => {
  return {
    amount: mapNumberToNumericAmount(deliveryCostsMoneyDto.amount),
    currency: mapCurrencyCodeToCurrency(deliveryCostsMoneyDto.currency),
  };
};
