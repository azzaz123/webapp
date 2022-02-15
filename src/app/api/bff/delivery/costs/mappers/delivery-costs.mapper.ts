import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';
import { DeliveryCostsDto, DeliveryCostsMoneyDto } from '@api/bff/delivery/costs/dtos';
import { mapCurrencyCodeToCurrency, mapNumberToNumericAmount } from '@api/core/mappers';
import { Money } from '@api/core/model/money.interface';
import { ToDomainMapper } from '@api/core/utils/types';

export const mapDeliveryCostsDtoToDeliveryCosts: ToDomainMapper<DeliveryCostsDto, DeliveryCosts> = (
  input: DeliveryCostsDto
): DeliveryCosts => {
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
