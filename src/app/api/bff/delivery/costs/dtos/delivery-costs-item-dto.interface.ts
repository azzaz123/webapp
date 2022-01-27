import { DeliveryCostsMoneyDto } from '@api/bff/delivery/costs/dtos/delivery-costs-money-dto.interface';

export interface DeliveryCostsItemDto {
  buyer_address_cost: DeliveryCostsMoneyDto;
  carrier_office_cost: DeliveryCostsMoneyDto;
}
